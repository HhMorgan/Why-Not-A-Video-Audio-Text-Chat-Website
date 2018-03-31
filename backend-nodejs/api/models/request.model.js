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
});

// Override the transform function of the schema to delete the expert name before it returns the object
if (!requestSchema.options.toObject) {
    requestSchema.options.toObject = {};
}

requestSchema.options.toObject.transform = (document, transformedDocument) => {
  delete transformedDocument.expert;
  return transformedDocument;
};

mongoose.model('Request', requestSchema);