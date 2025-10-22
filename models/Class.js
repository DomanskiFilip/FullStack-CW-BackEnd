const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  subject: String,
  location: String,
  price: Number,
  availablePlaces: Number
});

module.exports = mongoose.model('Class', classSchema);