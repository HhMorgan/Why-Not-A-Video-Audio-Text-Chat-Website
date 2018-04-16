var socketioJwt = require('socketio-jwt'),
config = require('../config/appconfig');

module.exports = function (io) {

    io.set('authorization', socketioJwt.authorize({
        secret: config.SECRET ,
        handshake: true
      }));

    io.on('connection', function(connection) {  
        console.log(connection);
        console.log('-----------------------------------')
        console.log(connection.request.decoded_token.user);
        console.log('-----------------------------------')
        console.log("User " + connection.request.decoded_token.user._id +" Connected");
      
        connection.join('test')
        connection.send(JSON.stringify('fuck you'))
      });
}