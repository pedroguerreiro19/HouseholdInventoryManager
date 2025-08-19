const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
    required: false,
    },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, 
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: false,
  },
  forFamily: {
    type: Boolean,
    default: false,
    required: false,
  },
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;