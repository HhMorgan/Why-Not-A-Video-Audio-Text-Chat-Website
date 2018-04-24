var Mongoose = require('mongoose').Mongoose;
var mongoose = new Mongoose();
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
Encryption = require('../api/utils/encryption');
var Tags = require('../api/models/Tag.model');
var Users = require('../api/models/user.model');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
let User1;
chai.use(chaiHttp);
let v;
let Tag ;
let User;
let Expert;
//describe('...', function() {
//	it("...", function(done) {
		// ...
//		done();
//	});
//});



process.env.NODE_ENV = 'test';
const base = process.env.PWDF;
var app = require('../app');

before(function(done) {
  this.timeout(2800000);
	mockgoose.prepareStorage().then(function() {
		mongoose.connect('mongodb://localhost:27017/StartUp-Connect-Database', function(err) {
//s      connection.name = connection.db.databaseNam
            
    done(err);
    });
    mongoose.connection.on('connected', () => {  
      console.log('db connection is now open');
    });
  });
});

// beforeEach(function(done) { 
//   mockgoose.helper.reset().then(() => {
//     done()
//   });
// });
//when getting the the path used below for ease of use the frontend to get do the 
// request and get the path
describe('Admin tests: ', () =>  {
  before(function(done) {
   
    Tag = new Tags({name: "Tarek" ,status:"Pending" ,blocked: false,});
    Tag.save((err, Tag) => {
    });

    User = new Users({username: "Jimmy" ,email:"Mahmoud@gmail.com" ,password: "9194591945" ,});
    User.save((err, User) => {
    });

    Expert = new Users({username: "Mahmoud" ,email:"mahmoudgamal@gmail.com" ,password: "9194591945" ,role: "expert" ,});
    User.save((err, User) => {
    });
    v = "tarek123";
   Encryption.hashPassword(v, function(err, hash){ 
     User1 = new Users({username: "Tarek" ,email:"tarek@abdocience.com" ,password: hash,});
    User1.save((err, User1) => {
    });
   });
    done();
    
  }),
  
  //describe('/GET /api/Tags/getTags', () => {
  it('it should GET all the Tags', (done) => {
 
   chai.request(app)
   .get('/api/Tags/getTags')
   .end((err, res) => {
   res.should.have.status(200);
   //.body.data is used because we return the result of our api request in the data
   // structure we made where it returns err,msg and data where data in this case is
   // the array of tags
   res.body.data.should.be.a('array');
//   res.body.data.should.have.property('_id');
// this takes the array and checks that every single tag has the correct data
// structure 
for (var i = 0 ; i < res.body.data ; i++ ){
   res.body.data[i].should.have.property('name');
   res.body.data[i].should.have.property('status');
   res.body.data[i].should.have.property('blocked');
}
   //res.body.length.should.be.eql(0);
   done();
   });
   });
   it('it should add a user', (done) => {
    chai.request(app).post('/api/auth/signup')
   .send({ username: "tarekk",email:"tarek@gmail.com" , password: "tarek12356",}).end((err, res) => {
           res.should.have.status(201);
           res.body.data.should.have.property('username');
           res.body.data.should.have.property('email');
           res.body.data.should.have.property('username').eql('tarekk');
           res.body.data.should.have.property('email').eql('tarek@gmail.com');
   done();
   });
   });
   it('it should login a user', (done) => {
    console.log(v);

    chai.request(app).post('/api/auth/login')
   .send({email: "tarek@abdocience.com" , password: "tarek123",}).end((err, res) => {
           res.should.have.status(200);
           //res.body.data.should.have.property(');
           res.body.should.be.a('object');
           //res.body.should.have.property('Welcome');
           //res.body.msg.should.have.property.eql('Welcome');
   done();
   });
   });
  // });
  it('it should UPDATE a Tag given the id on /api//Tag/editTags/ PATCH' , (done) => {
     chai.request(app).patch('/api//Tag/editTags/' + Tag.id)
     .send({name: "ana" , status: "Pending", blocked:false,}).end((err, res) => {
      res.should.have.status(200);     
        res.body.data.should.have.property('name');
        res.body.data.should.have.property('status');
        res.body.data.should.have.property('blocked');
   
        res.body.data.should.have.property('name').eql('ana');
        res.body.data.should.have.property('status').eql('Pending');
        res.body.data.should.have.property('blocked').eql(false);   

     done();    
  });
});
it('it should add a Tag POST /api/Tags/AddTag' , (done) => {
     chai.request(app).post('/api/Tags/AddTag')
     .send({name: "Mohamed" , status: "Accepted", blocked:false,}).end((err, res) => {
      res.should.have.status(201);     
        res.body.data.should.have.property('name');
        res.body.data.should.have.property('status');
        res.body.data.should.have.property('blocked');
   
        res.body.data.should.have.property('name').eql('Mohamed');
        res.body.data.should.have.property('status').eql('Accepted');
        res.body.data.should.have.property('blocked').eql(false);   
        
     done();    
  });
});
it('it should delete a Tag DELETE /api//Tags/deleteTags/' , (done) => {
  chai.request(app).delete('/api//Tags/deleteTags/' + Tag.id).end((err, res) => {
   res.should.have.status(200);     
      done();    
});
});

it('it should Block a User given the User_id on /User/blockUser/ PATCH' , (done) => {
     chai.request(app).patch('/api//User/blockUser/' + User.id)
     .end((err, res) => {
      res.should.have.status(200);     
        res.body.data.should.have.property('username');
        res.body.data.should.have.property('email');
        //res.body.data.should.have.property('password');
   
        res.body.data.should.have.property('username').eql('Jimmy');
        res.body.data.should.have.property('email').eql('mahmoud@gmail.com');
        res.body.data.should.have.property('blocked').eql(true);   

     done();    
  });
});

it('it should GET all the Users with their ratings', (done) => {
  chai.request(app)
  .get('/api//User/getUsers')
  .end((err, res) => {
  res.should.have.status(200);
  //.body.data is used because we return the result of our api request in the data
  // structure we made where it returns err,msg and data where data in this case is
  // the array of tags
  res.body.data.should.be.a('array');
//   res.body.data.should.have.property('_id');
// this takes the array and checks that every single tag has the correct data
// structure 
for (var i = 0 ; i < res.body.data ; i++ ){
  res.body.data[i].should.have.property('rating');
}
  
  done();
  });
  });
   });

//    after(function(done) {
// //    Tag.remove();
// // mockgoose.reset(function() {
// //   done();
// // });
// mongoose.disconnect(done);
    
//   });
after(function(done) {
   Tags.remove({}, (err) => {
  //   done();
   });
  // mockgoose.helper.reset().then(() => {
  // });
     
  // mongoose.disconnect(done);
done();
});

   //mockoose.disconnect(done);
  //  after(function(done) {
  //   mockgoose.

  // });

// describe('/api//Tag/editTags/:tagId PATCH' , () => {
//   it('it should UPDATE a Tag given the id on /api//Tag/editTags/ PATCH' , (done) => {
//      let Tag = new Tags({name: "Tarek" ,status:"Pending" ,blocked: false,})
//      Tag.save((err, Tag) => {
//      chai.request(app).put('/api//Tag/editTags/' + Tag.id)
//      .send({name: "ana" , status: "Pending", blocked:false,}).end((err, res) => {
//      res.should.have.status(200);
//      //res.body.should.be.a('object');
//      //res.body.should.have.property('message').eql('Book updated!' );
//      //res.body.book.should.have.property('year').eql(1950);
//      done();});});});});
    // let Tag = new Tags({name: "Dola" ,status:"Pending" ,blocked: false,})
    // Tag.save((err, Tag) => {
//       });
//     });

    
    
    
     
    

