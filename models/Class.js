const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  id: Number,
  subject: String,
  location: String,
  price: Number,
  availablePlaces: Number
}, { collection: 'CWFS' });

module.exports = mongoose.model('Class', classSchema);