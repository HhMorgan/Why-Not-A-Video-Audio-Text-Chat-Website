var mongoose = require('mongoose');

var TagsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  status: {
    type: String,
    trim: true,
    default: 'Pending'
  },
  
  blocked: {
    type:  Boolean,
    default: false
  },

}, { collection: 'Tags' }
);

module.exports = mongoose.model('Tag', TagsSchema);