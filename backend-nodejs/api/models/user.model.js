var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: false,
    default: 'user'
  },
  description: {
    type: String,
    required: false,
    // default: 'empty'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  img: 
  { type: Buffer },
  updatedAt: Date,
  onlineStatus:{type:Boolean}
});

// Override the transform function of the schema to delete the password before it returns the object
if (!userSchema.options.toObject) {
  userSchema.options.toObject = {};
}

userSchema.options.toObject.transform = (document, transformedDocument) => {
  delete transformedDocument.password;
  return transformedDocument;
};

mongoose.model('User', userSchema);