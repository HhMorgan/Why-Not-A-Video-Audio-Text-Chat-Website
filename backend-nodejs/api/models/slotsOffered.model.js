var mongoose = require('mongoose');

/*var slotsSchema = mongoose.Schema({
    slot: {
      type: String,
      required: true
    }
  });*/

var slotsOfferedSchema = mongoose.Schema({
  user_email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  expert_email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  slots: [String],
  status: {
    type: String
  },
});

// Override the transform function of the schema to delete the password before it returns the object
/*if (!userSchema.options.toObject) {
  userSchema.options.toObject = {};
}
userSchema.options.toObject.transform = (document, transformedDocument) => {
  delete transformedDocument.password;
  return transformedDocument;
};*/

mongoose.model('OfferedSlot', slotsOfferedSchema);