var mongoose = require('mongoose');
var fs = require('fs');
var userSchema = mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

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

  createdTags: {
    type: [String]
  },

  speciality: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],

  rating: {
    type: Number,
    default: 5
  },

  numberofsessions: {
    type: Number,
    default: 0
  },

  onlineStatus: {
    type: Boolean,
    default: true
  },

  //array containing all the experts id the user bookmarked
  bookmarks: [
    { 
      type: mongoose.Schema.Types.ObjectId , 
      ref: 'User' 
    }
  ],

  blocked: {
    type: Boolean,
    required: true,
    default: false
  },

  updatedAt: Date,

  img: {
    data: Buffer,
    contentType: String,
  },

  CoverImg: {
    data: Buffer,
    contentType: String,
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  verificationToken: {
    type: String,
  },
  
  verificationEmailToken:{
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: Date,

}, { collection: 'Users' });

userSchema.index( { createdAt: 1 } , { expireAfterSeconds: 300 , 
  partialFilterExpression: { isVerified: { $eq : false } } 
} );
// Override the transform function of the schema to delete the password before it returns the object
if (!userSchema.options.toObject) {
  userSchema.options.toObject = {};
}

userSchema.options.toObject.transform = (document, transformedDocument) => {
  delete transformedDocument.password;
  return transformedDocument;
};

module.exports = mongoose.model('User', userSchema);