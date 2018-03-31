var mongoose = require('mongoose');
var requestSchema = mongoose.Schema({
  user: {
    type: String,
    required: true,
    unique: true,
  },
  expert: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
      type :String,
      default : 'pending'
  },
  viewed: {
    type: String,
    default : 'false'
  }
},{collection: 'Requests'}
);


mongoose.model('Request', requestSchema);