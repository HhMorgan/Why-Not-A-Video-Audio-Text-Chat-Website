var express = require('express'),
  router = express.Router(),
  jwt = require('jsonwebtoken'),
  authCtrl = require('../controllers/auth.controller'),
  userCtrl = require('../controllers/user.controller'),
  sessionCtrl = require('../controllers/session.controller'),
  expert = require('../controllers/expert.controller'),
  AdminController = require('../controllers/admin.controller'),
  scheduleController = require('../controllers/schedule.controller')
NotificationController = require('../controllers/notification.controller');

var isAuthenticated = function (req, res, next) {
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
  jwt.verify(token, req.app.get('secret'), function (err, decodedToken) {
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

var isNotAuthenticated = function (req, res, next) {
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
var isExpert = function (req, res, next) {
  if (req.decodedToken.user.role.trim() !== 'expert' && req.decodedToken.user.role.trim() !== 'Expert') {
    return res.status(403).json({
      err: null,
      msg: 'Unauthorized.',
      data: null
    });
  }
  next();
};
//This function checks if the user is an admin to be authorized to certain functionalities
var isAdmin = function (req, res, next) {
  if (req.decodedToken.user.role.trim().toLowerCase() !== 'admin') {
    return res.status(403).json({
      err: null,
      msg: 'Unauthorized.',
      data: null
    });
  }
  next();
};
// all the methods below are all routers where we specify a route for api.service to 
// call and what method in the backend to go with the specefied route 
//-----------------------------Authentication Routes-------------------------
router.post('/auth/login', isNotAuthenticated, authCtrl.login);
router.post('/auth/signup', isNotAuthenticated, authCtrl.signup);
router.get('/auth/confirm/:email/:token', authCtrl.confirmEmail);
router.post('/auth/resendConfirmation', isAuthenticated, authCtrl.resendConfirmation);
//----------------------------Admin Routes ----------------------------------
router.post('/Tags/AddTag', isAuthenticated, isAdmin, AdminController.AddTag);
router.get('/Tags/getTags', isAuthenticated, AdminController.getTags);
router.patch('/Tag/editTags/:tagId', isAuthenticated, isAdmin, AdminController.editTag);
router.delete('/Tags/deleteTags/:tagId', isAuthenticated, isAdmin, AdminController.deleteTags);
router.patch('/User/BlockAndUnblock/:userId', isAuthenticated, isAdmin, AdminController.BlockAndUnblock);
router.patch('/User/ChangeRole/:userId', isAuthenticated, isAdmin, AdminController.ChangeRole);
router.get('/User/getUsers', AdminController.getUsers);
router.get('/getUsers', isAuthenticated, AdminController.getUsers);
router.post('/CreateAColor', AdminController.AddColor);
router.post('/addColorToTag', AdminController.AddColorToTag);
router.get('/getColors', AdminController.getColors);
router.get('/User/getUserRequestToBeExpert', AdminController.getRequestsFromUsersToBeExpert);
//----------------------------User Routes -----------------------------------
router.post('/auth/updateEmail', isAuthenticated, userCtrl.updateEmail);
router.post('/auth/updatePassword', isAuthenticated, userCtrl.updatePassword);
router.post('/auth/updateDescription', isAuthenticated, userCtrl.updateDescription);

//-----------------------------User Role Expert Routes-------------------------
router.get('/expert/getTagById/:tagId', isAuthenticated, expert.findTagbyid);
router.get('/expert/getTagByName/:tagname', isAuthenticated, expert.findTagbyname);
router.patch('/expert/addSpeciality/:tagId', isAuthenticated, expert.addSpeciality);
router.delete('/expert/editSpeciality/:tagId', isAuthenticated, expert.editSpeciality);
//-------------------------------------------------------------------

router.post('/photo', isAuthenticated, userCtrl.uploadimage);
router.post('/CoverImgUpload', isAuthenticated, userCtrl.uploadCoverPic);
router.get('/getphoto', isAuthenticated, userCtrl.getimage);
router.get('/getusername', isAuthenticated, userCtrl.getusername);
router.get('/user/getUserData', isAuthenticated, userCtrl.getUserData);
router.get('/loadStatus', isAuthenticated, userCtrl.loadStatus);
router.post('/auth/changeUserStatus', isAuthenticated, userCtrl.changeUserStatus);
router.get('/user/getUserProfile/:username', isAuthenticated, userCtrl.getUserProfile);

//----------------------------------------------------------------------------------------------------
router.get('/user/searchUserbyTags/:searchtag', userCtrl.searchUserbyTags);
router.get('/user/searchbyTags/:searchtag', userCtrl.searchbyTags);
router.get('/user/searchbyUser/:searchtag', userCtrl.searchbyUser);
router.get('/Notification/getNotifications', isAuthenticated, NotificationController.getNotifications);
// router.get('/Notification/AddNotifications', isAuthenticated, NotificationController.AddNotification);
//-----------------------------------------------------------------------------------------------------


//-----------------------------User Routes-------------------------
router.post('/user/updateRating', isAuthenticated, userCtrl.updateRating);
router.get('/getExpertSchedule/:userId', isAuthenticated, userCtrl.getExpertSchedule);
router.post('/user/upgradeToexpert', isAuthenticated, userCtrl.upgradeToExpert);
router.get('/user/viewSuggestedExperts/:tagName', isAuthenticated, userCtrl.viewSuggestedExperts);
router.post('/user/addToBookmarks/:expertId', isAuthenticated, userCtrl.addToBookmarks);
router.delete('/user/removeFromBookmarks/:expertId', isAuthenticated, userCtrl.removeFromBookmarks);
router.get('/user/viewBookmarks', isAuthenticated, userCtrl.viewBookmarks);
router.post('/user/getUserById', isAuthenticated, userCtrl.findUserbyId);

/* Schedule V2 */
//-------------------------------------------------------------------------------------
router.post('/user/chooseSlot/:expertEmail', isAuthenticated, expert.chooseSlot);
router.post('/expert/createSchedule', isAuthenticated, expert.createSchedule);
router.get('/expert/viewSchedule', expert.viewSchedule);
router.get('/expert/viewScheduledSlots', isAuthenticated, expert.viewScheduledSlots);
router.get('/expert/viewRequestedSlots', isAuthenticated, expert.viewRequestedSlots);
router.post('/expert/acceptRequest', isAuthenticated, expert.acceptRequest);
router.post('/expert/rejectRequest', isAuthenticated, expert.rejectRequest);
router.post('/expert/rejectallRequest', isAuthenticated, expert.rejectAllRequests);
//-------------------------------------------------------------------------------------

/* Main Schedule */
//----------------------------------------------------------------------------------------------------------------
router.get('/schedule/:expertID' , isAuthenticated , scheduleController.getSlots);
router.post('/schedule/userReserveSlot', isAuthenticated , scheduleController.userReserveSlot);
router.post('/schedule/expertOfferSlot', isAuthenticated , isExpert, scheduleController.expertOfferSlot);
router.post('/schedule/expertCancelSlot', isAuthenticated , isExpert, scheduleController.expertCancelSlot);
router.post('/schedule/expertAcceptSlot', isAuthenticated , isExpert, scheduleController.expertAcceptUserInSlot);
//----------------------------------------------------------------------------------------------------------------

module.exports = router;
