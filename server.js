require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const Class = require('./models/Class');


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));


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
    const results = await Class.find(query).sort(sort);
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));