var Mongoose = require('mongoose').Mongoose;
var mongoose = new Mongoose();
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

let Tags = require('../api/models/Tags.model' );

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var should = chai.should();

chai.use(chaiHttp);

//describe('...', function() {
//	it("...", function(done) {
		// ...
//		done();
//	});
//});



process.env.NODE_ENV = 'test';

before(function(done) {
  this.timeout(1800000);
	mockgoose.prepareStorage().then(function() {
		mongoose.connect('mongodb://localhost:27017/StartUp-Connect-Database', function(err) {
			done(err);
		});
	});
});

//describe('Tags', function() {
  //  it('should list ALL Tags on /api/Tags/getTags GET');
    // all these are wrong  the need the path to be like the one above 
    // try the actual command in the browser then look at the body of the request from
    //there
 //   it('should list a SINGLE Tags on /Tags/<id> GET');
    //it('should add a SINGLE Tags on /Tags POST');
   // it('should update a SINGLE Tags on /Tags/<id> PUT');
   // it('should delete a SINGLE Tags on /Tags/<id> DELETE');
 // });
//  it('should list ALL Tags on /api/Tags/getTags GET', function(done) {
//    chai.request(app)
//      .get('/api/Tags/getTags')
//      .end(function(err, res){
//        res.should.have.status(200);
//        done();
//     });
//      this.timeout(3000);
//  });

//when getting the the path used below for ease of use the frontend to get do the 
// request and get the path
describe('/GET /api/Tags/getTags', () => {
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
   });
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
    //  after(function(done) {
    //    Tag.remove({},function(err ){
    //       if(err){
    //         console.log(err);
    //       }
    //     });
    //     monckoose.disconnect(done);
    //    });
    //  });

    
    
    
     
    

