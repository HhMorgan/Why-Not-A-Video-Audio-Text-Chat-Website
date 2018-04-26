 var mongoose = require('mongoose');
 var colorSchema = mongoose.Schema({
   name: {
     type:String,
     required:true
   },
 },{ collection: 'Colors' }
 );
 
 mongoose.model('Color', colorSchema); 