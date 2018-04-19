var socketioJwt = require('socketio-jwt'),
config = require('../config/appconfig');

module.exports = function (io) {
    var users = {};
    io.set('authorization', socketioJwt.authorize({
        secret: config.SECRET ,
        handshake: true
      }));

    io.on('connection', function(connection) {  
        console.log('-----------------------------------')
        console.log(connection.request.decoded_token.user);
        console.log('-----------------------------------')
        console.log("User " + connection.request.decoded_token.user._id +" Connected");
        connection.on('message', function(message) { 
            var data; 
            //accepting only JSON messages 
            try {
                data = JSON.parse(message); 
            } catch (e) { 
                console.log("Invalid JSON"); 
                data = {}; 
            } 
            switch(data.type){
                case "Join":
                    connection.join(data.room);
                    connection.broadcast.to(data.room).emit('message' , 
                        JSON.stringify({
                        type : "Join" ,
                        msg : "Joined Room " + data.room ,
                        user : connection.request.decoded_token.user._id
                        })
                    )

                    // for (var socketId in io.nsps['/'].adapter.rooms['5accc80710884653ec3a3b14']) {
                    //     console.log(socketId);
                    // }
                    // io.sockets.in('5accc80710884653ec3a3b14').emit('message', JSON.stringify('hi 3ml ')); // kol nas including sending socket
                    // console.log(connection.adapter.nsp.adapter.rooms)
                    connection.request.decoded_token.user._id
                    connection.broadcast.to(data.room).emit('message' , 
                        JSON.stringify({
                           type : "User",
                           id : connection.request.decoded_token.user._id
                        })
                    );
                   
                break;

                case "OfferRequest":
                    connection.broadcast.to(data.room).emit('message' , 
                        JSON.stringify(
                            {
                                type: "OfferRequest",
                                from: connection.request.decoded_token.user._id,
                            }
                        )
                    );
                    console.log("offerrequest " + connection.request.decoded_token.user._id)
                break;
                case "offer":
                    broadCastToAll(connection , data.room , {
                        type : "offer",
                        offer : data.offer, 
                        from : connection.request.decoded_token.user._id,
                    })
                break;

                case "answer":
                    console.log("Sending answer to room : ", data.room); 

                    broadCastToAll(connection , data.room , {
                        type : "answer",
                        answer : data.answer, 
                        from : connection.request.decoded_token.user._id,
                    })
                break;

                case "candidate":
                    console.log("Sending candidate to room : ", data.room);

                    broadCastToAll(connection , data.room , {
                        type: "candidate", 
                        candidate: data.candidate,
                        from: connection.request.decoded_token.user._id,
                    })
                break;
                case "message": 
                     console.log("message : ", data.message); 
                     var conn = users[data.name];
                    //if anyone is logged in with this username then refuse 
                    if(users[data.name]) { 

                    sendTo(conn, { 
                        type: "message",
                         message : data.message
                    }); 
                    } else { 
                    //save user connection on the server 
                     //var conn = users[data.name];
                    sendTo(connection, { 
                         type: "message", 
                         message: "the user has disconnected" 
                     }); 
                    } 
				
                 break;
            }
        })
        connection.send(JSON.stringify('fuck you'))
      });
    
      function sendTo(connection, message) {
          console.log("sending to " + connection.request.decoded_token.user._id)
        connection.send(JSON.stringify(message)); 
    }

    function broadCastToAll( connection , room , message ) {
        for( var socketId in io.sockets.adapter.rooms[room].sockets) {
            var socketconnection = io.of("/").connected[socketId];
            if(socketconnection != null && connection.request.decoded_token.user._id != socketconnection.request.decoded_token.user._id){
                sendTo(socketconnection,message);
            }
        }
    }
}