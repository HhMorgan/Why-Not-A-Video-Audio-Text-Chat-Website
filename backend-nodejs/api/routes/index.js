 var express = require('express'),
  router = express.Router(),
  jwt = require('jsonwebtoken'),

  authCtrl = require('../controllers/auth.controller');
  userCtrl = require('../controllers/user.controller');
  sessionCtrl = require('../controllers/session.controller');
  expert = require('../controllers/expert.controller');
  AdminController = require('../controllers/Admin.Controller');
 
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

router.get('/getphoto' ,userCtrl.getimage);
router.post('/photo' ,userCtrl.uploadimage);

//-----------------------------Authentication Routes-------------------------
// another conflict and i don't know which to choose so i commented it
//router.post('/auth/login', isNotAuthenticated , authCtrl.login);
router.post('/auth/signup',isNotAuthenticated,authCtrl.signup);
//---------------------------------------------------------------------------

// all the methods below are all routers where we specify a route for api.service to 
// call and what method in the backend to go with the specefied route 
//-----------------------------Authentication Routes-------------------------
router.post('/auth/login',  authCtrl.login);
//----------------------------Admin Routes ----------------------------------
router.post('/Tags/AddTag', AdminController.AddTag);
router.get('/Tags/getTags' , AdminController.getTags);
router.patch('/Tag/editTags/:tagId', AdminController.editTag);
router.delete('/Tags/deleteTags/:tagId' , AdminController.deleteTags);
//----------------------------auth Routes -----------------------------------
router.post('/auth/updateEmail', isAuthenticated, userCtrl.updateEmail);
router.post('/auth/updatePassword', isAuthenticated, userCtrl.updatePassword);
router.post('/auth/updateDescription', isAuthenticated, userCtrl.updateDescription);

//-----------------------------Expert Routes-------------------------
router.post('/expert/chooseSlot',expert.chooseSlot);
//-------------------------------------------------------------------

router.post('/session/create' , isNotAuthenticated, sessionCtrl.createSession);
router.post('/session/addCandidate' , isNotAuthenticated, sessionCtrl.addCandidate);
router.post('/session/updateCandidate' , isNotAuthenticated, sessionCtrl.updateCandidate);
router.post('/session/getCandidatesRTCDes/:sessionId' , isNotAuthenticated, sessionCtrl.getCandidatesRTCDes);



//router.get('/user/getUserData', user.getUserData);


router.post('/expert/chooseSlot',expert.chooseSlot);

router.get('/expert/viewSlotRequest', isAuthenticated,expert.viewSLotRequests);
router.patch('/expert/editSlotRequest/:requestId', isAuthenticated,expert.editSlotRequest);


//router.get('/user/getUserData',user.getUserData);
router.post('/auth/updateRating',userCtrl.updateRating);
//router.post('/auth/updateEmail', isAuthenticated, userCtrl.updateEmail);
//router.post('/auth/updatePassword', isAuthenticated, userCtrl.updatePassword);
//router.post('/auth/updateDescription', isAuthenticated, userCtrl.updateDescription);

module.exports = router;


