process.env.NODE_ENV = 'test';
var jwt = require('jsonwebtoken');
var Mongoose = require('mongoose').Mongoose;
var mongoose = new Mongoose();
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
var config = require('../api/config/appconfig');
Encryption = require('../api/utils/encryption');
var Tags = require('../api/models/Tag.model');
var Users = require('../api/models/user.model');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
let User1;
chai.use(chaiHttp);
let v;
let Tag;
let Tag1;
let User;
let Userblocked;
let usedForUser;
let usedForExpert;
let usedForAdmin;
let Expert;
let token;

let salmaTag,salmaExpert;




const base = process.env.PWDF;
var app = require('../app');

before(function (done) {
  this.timeout(2800000);
  mockgoose.prepareStorage().then(function () {
    mongoose.connect('mongodb://localhost:27017/StartUp-Connect-Database-test', function (err) {
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
describe('Admin tests: ', () => {
  before(function (done) {

    Tag = new Tags({ name: "Tarek", status: "Accepted", blocked: false, });
    Tag.save((err, Tag) => {
    });
    Tag1 = new Tags({ name: "Tarek1", status: "Accepted", blocked: false, });
    Tag1.save((err, Tag1) => {
    });
    
    User = new Users({ username: "Jimmy", email: "Mahmoud@gmail.com", password: "9194591945" });
    User.save((err, User) => {
    });
    User.role = 'expert';
    User.blocked = true;

    Userblocked = new Users({ username: "Jimmy2", email: "Mahmoud2@gmail.com", password: "9194591945", blocked: true });
    Userblocked.save((err, User) => {
    });
    Userblocked.blocked = false;


    usedForUser = new Users({ username: "1", email: "1@gmail.com", password: "9194591945", role: "expert" });
    usedForUser.save((err, User) => {
    });
    usedForUser.role = 'user';

    usedForExpert = new Users({ username: "2", email: "2@gmail.com", password: "9194591945" });
    usedForExpert.save((err, User) => {
    });
    usedForExpert.role = 'expert';

    usedForAdmin = new Users({ username: "3", email: "3@gmail.com", password: "9194591945" });
    usedForAdmin.save((err, User) => {
    });
    usedForAdmin.role = 'admin';


    Expert = new Users({ username: "Mahmoud", email: "mahmoudgamal@gmail.com", password: "9194591945", role: "expert", });
    User.save((err, User) => {
      token = jwt.sign(
        {
          user : User
        },
        config.SECRET,
        {
          expiresIn: '12h'
        }
      );
    });
    v = "tarek123";
    Encryption.hashPassword(v, function (err, hash) {
      User1 = new Users({ username: "Tarek", email: "tarek@abdocience.com", password: hash, });
      User1.save((err, User1) => {
      });
    });
    done();
  }),
    it('getUsername Auth' , (done) => {
      chai.request(app).get('/api/getusername').set('authorization', token).end((err , res) =>{
        res.should.have.status(201);
        done();
      })
    }).timeout(5000);

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
          for (var i = 0; i < res.body.data; i++) {
            res.body.data[i].should.have.property('name');
            res.body.data[i].should.have.property('status');
            res.body.data[i].should.have.property('blocked');
          }
          //res.body.length.should.be.eql(0);
          done();
        });
    }).timeout(3000);
  // });
  it('it should UPDATE a Tag given the id on /api//Tag/editTags/ PATCH', (done) => {
    chai.request(app).patch('/api/Tag/editTags/' + Tag.id)
      .send({ name: "ana", status: "Pending", blocked: false, }).end((err, res) => {
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
  it('it should add a Tag POST /api/Tags/AddTag', (done) => {
    chai.request(app).post('/api/Tags/AddTag')
      .send({ name: "Mohamed", status: "Accepted", blocked: false, }).end((err, res) => {
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
  it('it should delete a Tag DELETE /api//Tags/deleteTags/', (done) => {
    chai.request(app).delete('/api/Tags/deleteTags/' + Tag.id).end((err, res) => {
      res.should.have.status(200);
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
        for (var i = 0; i < res.body.data; i++) {
          res.body.data[i].should.have.property('rating');
        }

        done();
      });
  });

  it('it should Block a User given the User_id on /User/BlockAndUnblock/ PATCH', (done) => {
    chai.request(app).patch('/api/User/BlockAndUnblock/' + User.id)
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

  it('it should UnBlock a User given the User_id on /User/BlockAndUnblock/ PATCH', (done) => {
    chai.request(app).patch('/api/User/BlockAndUnblock/' + Userblocked.id)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.have.property('username');
        res.body.data.should.have.property('email');
        //res.body.data.should.have.property('password');

        res.body.data.should.have.property('username').eql('Jimmy2');
        res.body.data.should.have.property('email').eql('mahmoud2@gmail.com');
        res.body.data.should.have.property('blocked').eql(false);

        done();
      });
  });



  it('it should change the role of the given user to an expert /api/User/ChangeRole/ PATCH', (done) => {
    chai.request(app).patch('/api/User/ChangeRole/' + usedForExpert.id)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.have.property('role').eql('expert');
        done();
      });
  });

  it('it should change the role of the given user to an admin /api/User/ChangeRole/ PATCH', (done) => {
    chai.request(app).patch('/api/User/ChangeRole/' + usedForAdmin.id)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.have.property('username');
        done();
      });
  });

  it('it should change the role of the given user to a user /api/User/ChangeRole/ PATCH', (done) => {
    chai.request(app).patch('/api/User/ChangeRole/' + usedForUser.id)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.have.property('role').eql('user');
        done();
      });
  });

});

describe('Auth tests: ', () => {
  //this tests if a user can login successfully
  it('it should login a user', (done) => {


    chai.request(app).post('/api/auth/login')
      .send({ email: "tarek@abdocience.com", password: "tarek123", }).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("msg");
        res.body.msg.should.be.eql("Welcome");
        res.body.should.have.property("data");
        done();
      });
  });
  //this tests if a user will not be logged in if he entered a wrong password
  it('it should not login a user', (done) => {


    chai.request(app).post('/api/auth/login')
      .send({ email: "tarek@abdocience.com", password: "tarek1223", }).end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property("msg");
        res.body.msg.should.be.eql("Password is incorrect.");

        done();
      });
  });
  it('it should add a user', (done) => {
    chai.request(app).post('/api/auth/signup')
      .send({ username: "tarekk", email: "tarek@gmail.com", password: "tarek12356", }).end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('msg');
        res.body.msg.should.be.eql('Registration successful, you can now login to your account.');

        res.body.data.should.have.property('username');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('username').eql('tarekk');
        res.body.data.should.have.property('email').eql('tarek@gmail.com');
        done();
      });
  });
  //this checks if signup will fail if user tried to add a profile that already exists
  it('it should not add a user', (done) => {
    chai.request(app).post('/api/auth/signup')
      .send({ username: "tarekk", email: "tarek@abdoscience.com", password: "tarek123", }).end((err, res) => {
        res.should.have.status(209);
        res.body.should.have.property('msg');
        res.body.msg.should.be.eql('Registration Failed');

        done();
      });
  });

});

describe('User tests: ', () => {
  before ( function(done) {
    salmaTag = new Tags({ name: "Finance", status: "Accepted", blocked: false});
    salmaTag.save((err, tag) => {
      salmaExpert = new Users({ username: "Salma" , email: "salma@gmail.com" , password: "9" , 
      role: "expert" , speciality : [tag._id] });
      done();
    });
  })

  it("Searching for a certain tag.", function(done){
    var tag = {
        'name' : 'Finance'
    }
    chai.request(app)
        .get('/api/user/viewSuggestedExperts/'+ tag.name)
        .set('authorization', token)
        .end(function(err,res) {
            res.status.should.be.eql(200);
            res.body.should.have.property("msg");
            res.body.msg.should.be.equal("Experts retrieved successfully.");        
            res.body.should.have.property("data");
            done();
        })
    });



  
  it('it should load user status  /api//loadStatus' , (done) => {
  
    chai.request(app).get('/api/loadStatus').set('authorization', token).end((err, res) => {
     res.should.have.status(201);
     res.body.should.have.property('msg');
     res.body.msg.should.be.eql('i.');
     res.body.data.should.be.eql(true);
     
        done();    
  });
  });
  it('it should add speciality  /api/expert/addSpeciality/:tagId' , (done) => {
  
 
  chai.request(app).patch('/api//expert/addSpeciality/'+  Tag1.id)
  .set('authorization', token)
  .end((err, res) => {
   res.should.have.status(201);
   res.body.should.have.property('msg');
   res.body.msg.should.be.eql('Speciality added');
   res.body.data[0].should.be.eql(Tag1.id);
   
   
      done();    
});
});
it('it should not add speciality  /api/expert/addSpeciality/:tagId' , (done) => {
  
 
  chai.request(app).patch('/api//expert/addSpeciality/'+  Tag.id)
  .set('authorization', token)
  .end((err, res) => {
   res.should.have.status(404);
   res.body.should.have.property('msg');
   res.body.msg.should.be.eql('This Tag is not found or is blocked. + Please request this tag first then add it as speciality');
   
   
      done();    
});
});
it('it should not load user status  /api//loadStatus' , (done) => {
  
  chai.request(app).get('/api/loadStatus').set('authorization', 0).end((err, res) => {
   res.should.have.status(401);
   res.body.should.have.property('msg');
   res.body.msg.should.be.eql('Login timed out, please login again.');
   
   
      done();    
});
});
 it('it should toggle online status  /api/auth/changeUserStatus' , (done) => {
  
  chai.request(app).post('/api/auth/changeUserStatus').set('authorization', token).end((err, res) => {
   res.should.have.status(201);
   res.body.should.have.property('msg');
   res.body.msg.should.be.eql('Online Status Successfully Toggled.');
   res.body.data.should.have.property('onlineStatus').equal(true);
   
      done();    
 });
 });
 it('it should not toggle online status /api/auth/changeUserStatus' , (done) => {
  
  chai.request(app).post('/api/auth/changeUserStatus').set('authorization', 0).end((err, res) => {
    res.should.have.status(401);
   res.body.should.have.property('msg');
   res.body.msg.should.be.eql('Login timed out, please login again.');
   
   
      done();    
 });
 });
  it('it should not find tag by id GET /api//expert/getTagById', (done) => {

    chai.request(app).post('/api/expert/expert/getTagById').send({ })
    .set('authorization', token).end((err, res) => {
      res.should.have.status(404);
      res.body.msg.should.be.eql('404 Not Found');

      done();
    });
  });
  it('it should  find a user  /api//user/getMatchingUsers/:searchtag', (done) => {

    chai.request(app).get('/api//user/getMatchingUsers/User').end((err, res) => {
      res.should.have.status(201);
      res.body.data.should.be.a('array');
      for (var i = 0; i < res.body.data; i++) {
        res.body.data[i].should.have.property('name');
        res.body.data[i].should.have.property('email');

      }

      done();
    });
  });

  it('it should send a request to the admin to become an expert Post /api//user/upgradeToexpert' , (done) => {
  
  chai.request(app).post('/api//user/upgradeToexpert').send({sender: '', recipient: 'admin', type: 'upgradeToExpert', 
  status: '', createdAt: '', viewed: false }).set('authorization', token).end((err, res) => {
    console.log(token.user);
   res.should.have.status(201);
   res.body.should.have.property('msg');
   res.body.data.should.have.property('recipient');
   res.body.data.should.have.property('type');
   res.body.msg.should.be.eql('Your request to being an expert has been sent to the admin.');
   res.body.data.recipient.should.be.eql('admin');
   res.body.data.type.should.be.eql('upgradeToExpert');
   
      done();    
});
});

it('it should bookmark an expert Post api//user/addToBookmarks/' , (done) => {
  
  chai.request(app).post('/api//user/addToBookmarks/' + usedForExpert._id).send().set('authorization', token).end((err, res) => {
    console.log(token.user);
   res.should.have.status(201);
   res.body.should.have.property('msg');
   res.body.msg.should.be.eql('The expert was successfully added to your array of bookmarks.');
   
   
      done();    
});
});

it('it should ge all bookmarked experts GET /api//user/viewBookmarks' , (done) => {
  
  chai.request(app).get('/api//user/viewBookmarks').set('authorization', token).end((err, res) => {
   res.should.have.status(200);
   res.body.should.have.property('msg');
   res.body.msg.should.be.eql('Bookmarks retrieved successfully.');
   res.body.data.should.be.a('array');
   
   
      done();    
});
});


});


after(function (done) {
  Tags.remove({}, (err) => {
  });
  Users.remove({}, (err) => {
  });
  // mockgoose.helper.reset().then(() => {
  // });

  // mongoose.disconnect(done);
  done();
});
