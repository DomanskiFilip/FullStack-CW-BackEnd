require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);
let lessonsCollection;
let db;

async function startServer() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    db = client.db('Classes');
    lessonsCollection = db.collection('CWFS');

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

startServer();

// Logger middleware: logs method, URL, and timestamp for every request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const IMAGE_DIR = path.join(__dirname, 'images');
const availableImages = fs.existsSync(IMAGE_DIR)
  ? fs.readdirSync(IMAGE_DIR).filter(file => /\.(png|jpe?g|webp|gif|svg)$/i.test(file))
  : [];

// Helper to handle lesson image URL
function resolveLessonImage(lesson, index, baseUrl) {
  if (lesson.image) {
    const normalized = lesson.image.replace(/^\/?images\//, '');
    return lesson.image.startsWith('https')
      ? lesson.image
      : `${baseUrl}/images/${normalized}`;
  }
  if (!availableImages.length) return null;
  // if lessons dont have img assigned but there are images in backend then assign based on order
  const anchor = typeof lesson.id === 'number' ? lesson.id - 1 : index;
  const file = availableImages[((anchor % availableImages.length) + availableImages.length) % availableImages.length];
  return `${baseUrl}/images/${file}`;
}

// Serve static images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Error handler for missing images
app.use('/images/:imageName', (req, res, next) => {
    const imagePath = path.join(__dirname, 'images', req.params.imageName);
    require('fs').access(imagePath, require('fs').constants.F_OK, (err) => {
        if (err) {
            res.status(404).json({ error: 'Image file does not exist' });
        } else {
            next();
        }
    });
});

// trust Render proxy needed for gihubpages
app.set('trust proxy', 1);
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || 'https://fullstack-cw-backend-d2z9.onrender.com';

// get cart for user
app.get('/cart', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  const cart = await db.collection('carts').findOne({ userId });
  res.json(cart ? cart.items : []);
});

// save/update cart for user
app.post('/cart', async (req, res) => {
  const { userId, items } = req.body;
  if (!userId || !Array.isArray(items)) return res.status(400).json({ error: 'Invalid payload' });
  await db.collection('carts').updateOne(
    { userId },
    { $set: { items } },
    { upsert: true }
  );
  res.json({ success: true });
});

// GET /search route: Handles search, filters, and sorting
app.get('/lessons', async (req, res) => {
  try {
    let query = {};

    // Search term (case-insensitive regex on subject/location)
    if (req.query.q) {
      const regex = new RegExp(req.query.q, 'i');
      query.$or = [
        { subject: regex },
        { location: regex }
      ];
    }

    // Subjects filter
    if (req.query.subjects) {
      const subjects = req.query.subjects.split(',');
      query.subject = { $in: subjects };
    }

    // Locations filter
    if (req.query.locations) {
      const locations = req.query.locations.split(',');
      query.location = { $in: locations };
    }

    // Availability filter
    if (req.query.availability === 'true') {
      query.availablePlaces = { $gt: 0 };
    }

    // Sorting
    let sort = {};
    const sortParam = req.query.sort;
    if (sortParam === 'price-asc') sort.price = 1;
    else if (sortParam === 'price-desc') sort.price = -1;
    else if (sortParam === 'subject-asc') sort.subject = 1;
    else if (sortParam === 'subject-desc') sort.subject = -1;
    else if (sortParam === 'availability-asc') sort.availablePlaces = 1;
    else if (sortParam === 'availability-desc') sort.availablePlaces = -1;

    // Fetch and return results
    const results = await lessonsCollection.find(query).sort(sort).toArray();
    const baseUrl = PUBLIC_BASE_URL;
    const resultsWithImages = results.map((lesson, idx) => {
      const image = resolveLessonImage(lesson, idx, baseUrl);
      return image ? { ...lesson, image } : lesson;
    });
    res.json(resultsWithImages);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Save order and user info
app.post('/order', async (req, res) => {
  const { userId, userInfo } = req.body;
  if (!userId || !userInfo) return res.status(400).json({ error: 'Missing userId or userInfo' });

  const cartDoc = await db.collection('carts').findOne({ userId });
  if (!cartDoc || !cartDoc.items || cartDoc.items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const order = {
    userId,
    userInfo,
    items: cartDoc.items,
    createdAt: new Date()
  };
  const result = await db.collection('orders').insertOne(order);

  res.json({ success: true, orderId: result.insertedId });
});

// update available spaces in ordered lessons
app.put('/lesson/:id', async (req, res) => {
  const lessonId = req.params.id;
  const update = req.body;
  if (!lessonId || !update || typeof update !== 'object') {
    return res.status(400).json({ error: 'Missing lessonId or update data' });
  }

  try {
    const result = await lessonsCollection.updateOne(
      { _id: new ObjectId(lessonId) },
      { $set: update }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});