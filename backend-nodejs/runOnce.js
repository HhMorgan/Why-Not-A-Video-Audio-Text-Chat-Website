var MongoClient = require('mongodb').MongoClient;
var nodemailerController = require('./api/controllers/nodemailer.controller');
var url = "mongodb://localhost:27017/";


// nodemailerController.sendEmail(
//   "ahmed.ayman.v1@12345.com",
//   'Testing',
//   'Hi:</p>',
//   function(done) {
//     console.log(done);
//   }
// )

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("StartUp-Connect-Database");

  var requestsObj = [
    { sender: 'test1@gmail.com', recipient: 'expert1@gmail.com', status: 'pending', createdAt: '21/10/2010', viewed: false, type: 'slotRequest' },
    { sender: 'test2@gmail.com', recipient: 'expert2@gmail.com', status: 'pending', createdAt: '21/10/2010', viewed: false, type: 'slotRequest' },
    { sender: 'test3@gmail.com', recipient: 'expert1@gmail.com', status: 'pending', createdAt: '21/10/2010', viewed: false, type: 'slotRequest' },
  ];
  var ReservedSlotsObj = [
    {},
  ];
  var collectionsObj = [
    { name: 'Tags', data: null },
    { name: 'Users', data: null },
    { name: 'Sessions', data: null },
    { name: 'Requests', data: null },
    { name: 'Schedules', data: null },
    { name: 'Notifications', data: null },
  ];

  dropCollectionsMuitiple( dbo , collectionsObj , 0 , function(done) {
    console.log('Done');
    db.close();
  })

  // for (var i = 0; i < collectionsObj.length; i++){
  //   if(collectionsObj[i].data == null){
  //     dbo.createCollection(collectionsObj[i].name , function(err, res){
  //       if(err) throw err;
  //       done = true;
  //     });
  //   } else {
  //     dbo.collection(collectionsObj[i].name).insertMany(collectionsObj[i].data,function(err,res) {
  //       if(err) throw err;
  //       done = true;
  //     });
  //   }
  //   console.log("Collection: "+collectionsObj[i].name+" created !");
  // }
});

function dropCollectionsMuitiple(dbo, collections, i, done) {
  if (i == collections.length) {
    return done(true);
  } else {
    dbo.collection(collections[i].name).drop(function (err, delOK) {
      if (err) throw err;
      if (delOK) console.log("Collection " + collections[i].name + "deleted");
      return dropCollectionsMuitiple(dbo, collections, i + 1, done);
    });
  }
}