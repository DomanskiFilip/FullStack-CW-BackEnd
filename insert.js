// Insert data into MongoDB
const mongoose = require('mongoose');
const Class = require('./models/Class');

mongoose.connect('mongodb://localhost:27017/classshop');

const classes = [
  { id: 1, subject: 'Mathematics', location: 'London Hendon Campus', price: 120, availablePlaces: 5 },
  { id: 2, subject: 'Mathematics', location: 'Oxford Campus', price: 128, availablePlaces: 10 },
  { id: 3, subject: 'Mathematics', location: 'Cambridge Campus', price: 135, availablePlaces: 0 },
  { id: 4, subject: 'Physics', location: 'London Hendon Campus', price: 140, availablePlaces: 7 },
  { id: 5, subject: 'Physics', location: 'Manchester Campus', price: 148, availablePlaces: 3 },
  { id: 6, subject: 'Physics', location: 'Edinburgh Campus', price: 155, availablePlaces: 9 },
  { id: 7, subject: 'Chemistry', location: 'London Central Campus', price: 132, availablePlaces: 1 },
  { id: 8, subject: 'Chemistry', location: 'Berlin Campus', price: 138, availablePlaces: 8 },
  { id: 9, subject: 'Chemistry', location: 'Paris Campus', price: 144, availablePlaces: 4 },
  { id: 10, subject: 'Biology', location: 'Oxford Campus', price: 125, availablePlaces: 6 },
  { id: 11, subject: 'Biology', location: 'Cambridge Campus', price: 131, availablePlaces: 2 },
  { id: 12, subject: 'Biology', location: 'Warsaw Campus', price: 137, availablePlaces: 10 },
  { id: 13, subject: 'Computer Science', location: 'London Central Campus', price: 160, availablePlaces: 0 },
  { id: 14, subject: 'Computer Science', location: 'Berlin Campus', price: 168, availablePlaces: 5 },
  { id: 15, subject: 'Computer Science', location: 'Krakow Campus', price: 176, availablePlaces: 7 },
  { id: 16, subject: 'English', location: 'Edinburgh Campus', price: 102, availablePlaces: 9 },
  { id: 17, subject: 'English', location: 'Paris Campus', price: 108, availablePlaces: 3 },
  { id: 18, subject: 'English', location: 'London Hendon Campus', price: 112, availablePlaces: 8 },
  { id: 19, subject: 'History', location: 'Manchester Campus', price: 118, availablePlaces: 4 },
  { id: 20, subject: 'History', location: 'Oxford Campus', price: 124, availablePlaces: 1 },
  { id: 21, subject: 'History', location: 'Cambridge Campus', price: 130, availablePlaces: 6 },
  { id: 22, subject: 'Geography', location: 'Manchester Campus', price: 115, availablePlaces: 10 },
  { id: 23, subject: 'Geography', location: 'Berlin Campus', price: 122, availablePlaces: 2 },
  { id: 24, subject: 'Geography', location: 'Paris Campus', price: 128, availablePlaces: 5 },
  { id: 25, subject: 'Art', location: 'Warsaw Campus', price: 96, availablePlaces: 7 },
  { id: 26, subject: 'Art', location: 'Paris Campus', price: 102, availablePlaces: 0 },
  { id: 27, subject: 'Art', location: 'London Central Campus', price: 108, availablePlaces: 9 },
  { id: 28, subject: 'Music', location: 'Cambridge Campus', price: 115, availablePlaces: 3 },
  { id: 29, subject: 'Music', location: 'Krakow Campus', price: 122, availablePlaces: 8 },
  { id: 30, subject: 'Music', location: 'Manchester Campus', price: 128, availablePlaces: 4 }
];

Class.insertMany(classes)
  .then(() => {
    console.log('Data inserted successfully');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Insertion error:', err);
    mongoose.disconnect();
  });