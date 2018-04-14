var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("StartUp-Connect-Database");


  var requestsObj = [
    { sender: 'test1@gmail.com', recipient:'expert1@gmail.com',status:'pending',createdAt:'21/10/2010',viewed:false,type:'slotRequest'},
    { sender: 'test2@gmail.com', recipient:'expert2@gmail.com',status:'pending',createdAt:'21/10/2010',viewed:false,type:'slotRequest'},
    { sender: 'test3@gmail.com', recipient:'expert1@gmail.com',status:'pending',createdAt:'21/10/2010',viewed:false,type:'slotRequest'},
  ];

 
  var ReservedSlotsObj = [{
    slotDate: ''
  }
  ];
  var collectionsObj = [
    {name: 'Requests', data: requestsObj},

    {name: 'ReservedSlots', data: ReservedSlotsObj},




  ];


  for (var i = 0; i < collectionsObj.length; i++){
    if(collectionsObj[i].data == null){
      dbo.createCollection(collectionsObj[i].name , function(err, res){
        if(err) throw err;
        done = true;
      });
    } else {
      dbo.collection(collectionsObj[i].name).insertMany(collectionsObj[i].data,function(err,res) {
        if(err) throw err;
        done = true;
      });
    }
    console.log("Collection: "+collectionsObj[i].name+" created !");
  }
  console.log("Press Control C");
});
