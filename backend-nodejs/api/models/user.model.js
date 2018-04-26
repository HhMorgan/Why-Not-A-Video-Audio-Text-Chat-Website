var mongoose = require('mongoose');
var fs = require('fs');
var userSchema = mongoose.Schema( {

  username: {
    type: String,
    required: true,
    unique: true,
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

  createdAt: {
    type: Date,
    default: Date.now
  },

  speciality: [ { type: mongoose.Schema.Types.ObjectId , ref: 'Tag'  }  ],
  
  schedule: { /* Must Change */
    type: [String],
    required: true,
  },

  updatedAt: Date ,
 
  rating: {
    type : Number,
    default:5
  },

  numberofsessions: {
    type : Number,
    default:0    
  },

  onlineStatus: {
    type : Boolean,
    default: true
  },

  bookmarks: [{ type: mongoose.Schema.Types.ObjectId , ref: 'User'  }],

  blocked: {
    type: Boolean,
    required: true,
    default: false
  },

  img: { 
    data: Buffer , 
    contentType: String ,
  } ,

  updatedAt: Date,
  
},


{ collection: 'Users' } );
// Override the transform function of the schema to delete the password before it returns the object
if (!userSchema.options.toObject) {
  userSchema.options.toObject = {};
}

userSchema.options.toObject.transform = (document, transformedDocument) => {
  delete transformedDocument.password;
  return transformedDocument;
};

module.exports = mongoose.model('User', userSchema);