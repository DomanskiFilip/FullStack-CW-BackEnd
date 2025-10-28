require('dotenv').config();
const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);
let lessonsCollection;

async function startServer() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    const db = client.db('Classes');
    lessonsCollection = db.collection('CWFS');

    app.listen(3000, () => console.log('Server running on http://localhost:3000'));
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

startServer();

// GET /search route: Handles search, filters, and sorting
app.get('/search', async (req, res) => {
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
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});