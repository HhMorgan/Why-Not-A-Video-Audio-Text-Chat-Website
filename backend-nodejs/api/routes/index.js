 var express = require('express'),
  router = express.Router(),
  jwt = require('jsonwebtoken'),
  authCtrl = require('../controllers/auth.controller'),
  userCtrl = require('../controllers/user.controller'),
  sessionCtrl = require('../controllers/session.controller'),
  expert = require('../controllers/expert.controller'),
  AdminController = require('../controllers/Admin.Controller'),
  scheduleController = require('../controllers/schedule.controller');
 
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
var isExpert = function(req,res,next){
  if(req.decodedToken.user.role.trim() !== 'expert' && req.decodedToken.user.role.trim() !== 'Expert' ){
    return res.status(403).json({
       err: null,
       msg: 'Unauthorized.',
       data: null });
  }
  next();
};
// all the methods below are all routers where we specify a route for api.service to 
// call and what method in the backend to go with the specefied route 
//-----------------------------Authentication Routes-------------------------
router.post('/auth/login' , isNotAuthenticated , authCtrl.login);
router.post('/auth/signup' , isNotAuthenticated , authCtrl.signup);
//----------------------------Admin Routes ----------------------------------
router.post('/Tags/AddTag', AdminController.AddTag);
router.get('/Tags/getTags' , AdminController.getTags);
router.patch('/Tag/editTags/:tagId', AdminController.editTag);
router.delete('/Tags/deleteTags/:tagId' , AdminController.deleteTags);
router.patch('/User/blockUser/:userId', AdminController.blockUser);
router.patch('/User/downgradeExpert/:userId', AdminController.downgradeExpertToUser);
router.get('/User/getUsers',AdminController.getUsers);
router.get('/getUsers',isAuthenticated, AdminController.getUsers);  
//----------------------------User Routes -----------------------------------
router.post('/auth/updateEmail', isAuthenticated , userCtrl.updateEmail);
router.post('/auth/updatePassword', isAuthenticated , userCtrl.updatePassword);
router.post('/auth/updateDescription', isAuthenticated , userCtrl.updateDescription);

//-----------------------------User Role Expert Routes-------------------------
router.post('/expert/chooseSlot',expert.chooseSlot);
router.get('/expert/viewSlotRequest', isAuthenticated , expert.viewSLotRequests);
router.get('/expert/getTagById/:Tags_ids' , expert.findTagbyid);
router.patch('/expert/editSlotRequest/:requestId', isAuthenticated , expert.editSlotRequest);
router.post('/expert/addSpeciality', isAuthenticated , expert.addSpeciality); 
router.delete('/expert/editSpeciality/:tagId',isAuthenticated,expert.editSpeciality);
//-------------------------------------------------------------------
router.post('/session/create' , isNotAuthenticated, sessionCtrl.createSession);
router.post('/session/addCandidate' , isNotAuthenticated, sessionCtrl.addCandidate);
router.post('/session/updateCandidate' , isNotAuthenticated, sessionCtrl.updateCandidate);
router.post('/session/getCandidatesRTCDes/:sessionId' , isNotAuthenticated, sessionCtrl.getCandidatesRTCDes);

router.post('/photo', isAuthenticated , userCtrl.uploadimage);
router.get('/getphoto', isAuthenticated , userCtrl.getimage);
router.get('/getusername', isAuthenticated , userCtrl.getusername);
router.get('/user/getUserData', isAuthenticated , userCtrl.getUserData);
router.get('/user/getpassword', isAuthenticated , userCtrl.getpassword);
router.get('/loadStatus', isAuthenticated , userCtrl.loadStatus);
router.post('/auth/changeUserStatus' , isAuthenticated , userCtrl.changeUserStatus);
router.get('/user/getUserProfile/:username' , isAuthenticated , userCtrl.getUserProfile);

//-----------------------------User Routes-------------------------
router.post('/user/updateRating', isAuthenticated , userCtrl.updateRating);
router.get('/getExpertSchedule/:userId', isAuthenticated, userCtrl.getExpertSchedule);
router.post('/user/upgradeToexpert', isAuthenticated , userCtrl.upgradeToExpert);
//to get offered slots:
router.get('/user/getOfferedSlots', isAuthenticated, userCtrl.getOfferedSlots);
//to choose slot
router.post('/user/reserveSlot', isAuthenticated, userCtrl.reserveSlot);
router.get('/user/viewSuggestedExperts/:tagName', isAuthenticated, userCtrl.viewSuggestedExperts);
router.post('/user/addToBookmarks/:expertId', isAuthenticated, userCtrl.addToBookmarks);
router.get('/user/viewBookmarks', isAuthenticated , userCtrl.viewBookmarks);

router.get('/schedule/:expertID' , isAuthenticated , scheduleController.getSlots )
router.post('/schedule/userReserveSlot' , isAuthenticated , scheduleController.userReserveSlot);

router.post('/schedule/offerSlot' , isAuthenticated , isExpert , scheduleController.expertOfferSlot);
router.post('/schedule/expertAcceptSlot' , isAuthenticated , isExpert , scheduleController.expertAcceptUserInSlot);



module.exports = router;