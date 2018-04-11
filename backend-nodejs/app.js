// Execute the mongoDB file to create, define the collections and connect to the database
require('./api/config/mongoDB');

var express = require('express'),
  logger = require('morgan'),
  cors = require('cors'),
  helmet = require('helmet'),
  compression = require('compression'),
  bodyParser = require('body-parser'),
  routes = require('./api/routes'),
  config = require('./api/config'),
  app = express();
  var fs = require('fs');
  var multer = require('multer');
  var fileType = "";
var done = false;

var fileTypeEnum = {
    AUDIO: "audio",
    VIDEO: "video",
    IMAGE: "image",
    DOCUMENT: "document"
};

// Set the secret of the app that will be used in authentication
app.set('secret', config.SECRET);

// Middleware to log all of the requests that comes to the server
app.use(logger(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Middleware to allow requests from any frontend that is not hosted on the same machine as the server's
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  })
);

//old
//app.use(multer({storage: multer.memoryStorage() /*, limits: { fileSize: 500000000 }*/ }).single('file'));
app.use(multer({dest:'./upload' /*, limits: { fileSize: 500000000 }*/ }).single('file'));

/* uploadsuccess = function(fileR) {
  console.log('uploadsuccess');

};
//new
app.use(multer({
  ///////////////////////////////////////
  //dest
  dest: './uploads/',

  ///////////////////////////////////////
  //rename
  rename: function (fieldname, filename) {
      console.log('rename');
      return filename + Date.now();     
  },

  ///////////////////////////////////////
  //In clude empty
  includeEmptyFields: true,

  onError: function (error, next) {
      console.log(error);
      next(error);
  },

      ///////////////////////////////////////
  //Start upload
  onFileUploadStart: function (file, req, res) {
      console.log("start");
      var propValue;
      for (var propName in req) {
          propValue = req[propName];
          console.log(propName, propValue);
      }

      console.log(file.originalname + ' is starting ... onFileUploadStart');
      fileType = "";
      done = false;

      if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/x-tiff'
          || file.mimetype == 'image/tiff' || file.mimetype == 'image/gif' || file.mimetype == 'image/svg+xml') {

          fileType = fileTypeEnum.IMAGE;
      }

      else if(file.mimetype == 'application/x-troff-msvideo'
          || file.mimetype == 'video/avi' || file.mimetype == 'video/msvideo' || file.mimetype == 'video/x-msvideo' || file.mimetype == 'video/x-ms-wmv'
          || file.mimetype == 'video/vnd.uvvu.mp4' ||   file.mimetype == 'video/mp4' || file.mimetype == 'application/mp4'
          || file.mimetype == 'video/mpeg' ||  file.mimetype == 'video/quicktime' ) {
         // fileType = fileTypeEnum.VIDEO;
      }

      else if(file.mimetype == 'application/pdf') {
          //fileType = fileTypeEnum.DOCUMENT;
      }

      else if (file.mimetype == 'audio/mpeg' || file.mimetype == 'audio/x-mpeg' || file.mimetype == 'audio/mpeg3'
          || file.mimetype == 'audio/x-mpeg-3' || file.mimetype == 'audio/mp4') {
        //  fileType = fileTypeEnum.AUDIO;
      } else {
          done = true;
          return false;

      }

      console.log(fileType);
      return true;

  },

  ///////////////////////////////////////
  //Upload Complete
  onFileUploadComplete: uploadsuccess,

  ///////////////////////////////////////
  //Parse End
 /*  onParseEnd: function(req, next) {



      console.log("Parse End");


      if (!(req.files.file === undefined)) {

          var resultsObj = { Verified: true, PostID: '1111-1111-22222222-2222' };


              var uploadFilePath = './uploads/' + resultsObj.PostID;

              console.log(req.files);

              fs.rename(req.files.file.path, uploadFilePath, function (er) {


              });



          next();
      }

      next();

  } */
//}).single('file'));
 
/* app.use(require('multer')({
  storage: multer.memoryStorage(),
  limits: {
    fieldNameSize: 999999999,
    fieldSize: 999999999
  },
  includeEmptyFields: true,
  inMemory: true,
  onFileUploadStart: function(file) {
    console.log('Starting ' + file.fieldname);
  },
  onFileUploadData: function(file, data) {
    console.log('Got a chunk of data!');
  },
  onFileUploadComplete: function(file) {
    console.log('Completed file!');
  },
  onParseStart: function() {
    console.log('Starting to parse request!');
  },
  onParseEnd: function(req, next) {
    console.log('Done parsing!');
    next();
  },
  onError: function(e, next) {
    if (e) {
      console.log(e.stack);
    }
    next();
  }
}).single('file'));
 */
// Middleware to protect the server against common known security vulnerabilities
app.use(helmet());

// Middleware to compress the server json responses to be smaller in size
app.use(compression());

/* 
  Middleware to parse the request body that is in format "application/json" or
  "application/x-www-form-urlencoded" as json and make it available as a key on the req 
  object as req.body
*/
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

/*
  Middleware to match the request with one of our defined routes to do a certain function,
  All requests should have /api before writing the route as a convention for api servers
*/
app.use('/api', routes);

// Middleware to handle any (500 Internal server error) that may occur while doing database related functions
app.use(function(err, req, res, next) {
  if (err.statusCode === 404) return next();
  res.status(500).json({
    // Never leak the stack trace of the err if running in production mode
    err: process.env.NODE_ENV === 'production' ? null : err,
    msg: '500 Internal Server Error',
    data: null
  });
});

/* 
  Middleware to handle any (404 Not Found) error that may occur if the request didn't find
  a matching route on our server, or the requested data could not be found in the database
*/
app.use(function(req, res) {
  res.status(404).json({
    err: null,
    msg: '404 Not Found',
    data: null
  });
});

module.exports = app;
