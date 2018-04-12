var mongoose = require('mongoose');
var fs = require('fs');
var userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
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
  speciality:{
    type: Array,
    "default":[]
  },
  // speciality:[new mongoose.Schema(
  //   {id: 
  //     {type: mongoose.Schema.Types.ObjectId ,
  //       ref:'Tags'
  //     }
  //   })],
  

  updatedAt: Date,

  rating: {
  type : Number,
  default:5},
  
  numberofsessions: {
    type : Number,
    default:0
    
  },

  onlineStatus: {
    type : Boolean,
    default: true
  },

  img: 
  { data: Buffer ,default:fs.readFileSync('./upload/images.png')},
  updatedAt: Date
},{collection: 'Users'});
// Override the transform function of the schema to delete the password before it returns the object
if (!userSchema.options.toObject) {
  userSchema.options.toObject = {};
}

userSchema.options.toObject.transform = (document, transformedDocument) => {
  delete transformedDocument.password;
  return transformedDocument;
};

mongoose.model('User', userSchema);