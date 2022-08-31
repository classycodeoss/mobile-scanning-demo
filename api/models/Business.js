// Business.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Business = new Schema({
  name: {
    type: String
  },
  ean: {
    type: String
  },
  image: {
    type: String
  },
  price: {
    type: Number
  }
},{
    collection: 'pwa'
});

module.exports = mongoose.model('Business', Business);
