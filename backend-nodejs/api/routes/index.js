var express = require('express'),
  router = express.Router(),
  jwt = require('jsonwebtoken'),
  authCtrl = require('../controllers/auth.controller');
  userCtrl = require('../controllers/user.contoller');
  expert = require('../controllers/expert.controller');


var isAuthenticated = function(req, res, next) {
  // Check that the request has the JWT in the authorization header
  var token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({
      error: null,
      msg: 'You have to login first before you can access your lists.',
      data: null
    });
  }
  // Verify that the JWT is created using our server secret and that it hasn't expired yet
  jwt.verify(token, req.app.get('secret'), function(err, decodedToken) {
    if (err) {
      return res.status(401).json({
        error: err,
        msg: 'Login timed out, please login again.',
        data: null
      });
    }
    req.decodedToken = decodedToken;
    next();
  });
};

var isNotAuthenticated = function(req, res, next) {
  // Check that the request doesn't have the JWT in the authorization header
  var token = req.headers['authorization'];
  if (token) {
    return res.status(403).json({
      error: null,
      msg: 'You are already logged in.',
      data: null
    });
  }
  next();
};

//-----------------------------Authentication Routes-------------------------
router.post('/auth/register', isNotAuthenticated, authCtrl.register);
router.post('/auth/login',  authCtrl.login); //edited
//-----------------------------Editing/Viewing Profile Routes-------------------------
router.post('/auth/updateEmail', isAuthenticated, userCtrl.updateEmail);
router.post('/auth/updatePassword', isAuthenticated, userCtrl.updatePassword);
router.post('/auth/updateDescription', isAuthenticated, userCtrl.updateDescription);
router.post('/photo' ,userCtrl.uploadimage);
router.get('/getphoto' ,userCtrl.getimage);
//-----------------------------Expert Routes-------------------------
router.post('/expert/chooseSlot',expert.chooseSlot);

module.exports = router;
