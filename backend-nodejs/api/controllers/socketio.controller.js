var socketioJwt = require('socketio-jwt'),
config = require('../config/appconfig');
var users = {};
module.exports = function (io) {
    
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
                    sendTo(connection , {
                        type : "Join" ,
                        msg : "Joined Room " + data.room
                    })
                    // for (var socketId in io.nsps['/'].adapter.rooms['5accc80710884653ec3a3b14']) {
                    //     console.log(socketId);
                    // }
                    // io.sockets.in('5accc80710884653ec3a3b14').emit('message', JSON.stringify('hi 3ml ')); // kol nas including sending socket
                    // console.log(connection.adapter.nsp.adapter.rooms)
                    connection.broadcast.to(data.room).emit('message' , JSON.stringify("User " + connection.request.decoded_token.user._id +" Connected"));
                    console.log(io.sockets.adapter.rooms[data.room].sockets)
                break;
                

                case "message": 
                    
                    console.log("message : ", data.message); 
                    //var conn = users[data.name];
                    //if anyone is logged in with this username then refuse
                    connection.broadcast.to(data.room).emit('message' , 
                    JSON.stringify(
                        {
                            type: "message",
                            message : data.message
                        }
                    )
                ); 
               break; 
                



                case "offer": 
                    console.log("Sending offer to room : ", data.room); 
                    connection.broadcast.to(data.room).emit('message' , 
                        JSON.stringify(
                            {
                                type: "offer", 
                                offer: data.offer, 
                            }
                        )
                    );
                break;

                case "answer":
                    console.log("Sending answer to room : ", data.room); 
                    connection.broadcast.to(data.room).emit('message' , 
                        JSON.stringify(
                            {
                                type: "answer", 
                                answer: data.answer, 
                            }
                        )
                    );
                break;
                    
                case "candidate":
                    console.log("Sending candidate to room : ", data.room);
                    connection.broadcast.to(data.room).emit('message' , 
                        JSON.stringify(
                            {
                                type: "candidate", 
                                candidate: data.candidate 
                            }
                        )
                    );
                break;
            }
        })
        connection.send(JSON.stringify('fuck you'))
      });
    
      function sendTo(connection, message) {
          console.log("sending to " + connection.request.decoded_token.user._id)
        connection.send(JSON.stringify(message)); 
    }
}