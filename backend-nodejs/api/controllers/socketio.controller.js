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
                    connection.broadcast.to(data.room).emit('message' , 
                        JSON.stringify({
                        type : "Join" ,
                        msg : "Joined Room " + data.room ,
                        userid : connection.request.decoded_token.user._id
                        })
                    )
                    sendAllConnectedUsersinRoom(connection,data.room);
                    // io.sockets.in('5accc80710884653ec3a3b14').emit('message', JSON.stringify('hi 3ml ')); // kol nas including sending socket
                break;
                

                case "message": 
                    
                    console.log("message : ", data.message,", id : ", data.name); 
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
                    console.log("Sending offer to : ", data.to);
                    if( isConnectioninRoom( connection , data.room ) ){
                        send_To_Using_ID( connection , data.to , data.room , {
                            type : "offer",
                            offer : data.offer, 
                            from : connection.request.decoded_token.user._id,
                        })
                    }
                break;

                case "answer":
                    console.log("Sending answer to : ", data.to);
                    if( isConnectioninRoom( connection , data.room ) ){
                        send_To_Using_ID( connection , data.to , data.room , {
                            type : "answer",
                            answer : data.answer, 
                            from : connection.request.decoded_token.user._id,
                        })
                    }
                break;
                    
                case "candidate":
                    console.log("Sending candidate to room : ", data.room);
                    if( isConnectioninRoom( connection , data.room ) ){
                        send_To_Using_ID( connection , data.to , data.room , {
                            type: "candidate", 
                            candidate: data.candidate,
                            from: connection.request.decoded_token.user._id,
                        })
                    }
                break;

                case "close":
                    if( isConnectioninRoom( connection , data.room ) ){
                        send_To_Using_ID( connection , data.userid , data.room , {
                            type: "close", 
                            from: connection.request.decoded_token.user._id,
                        })
                    }
                break;
               
            }
        })
        connection.send(JSON.stringify(
            {
                type : "connected"
            }
        ))
      });
    
    function sendTo(connection, message) {
          console.log("sending to " + connection.request.decoded_token.user._id)
        connection.send(JSON.stringify(message)); 
    }

    function isConnectioninRoom(connection , room) {
        for( var socketId in io.sockets.adapter.rooms[room].sockets) {
            var socketconnection = io.of("/").connected[socketId];
            if(socketconnection == connection ) {
                return true;
            }
        }
        return false;
    }

    function send_To_Using_ID( connection , userid , room  , message ){
        for( var socketId in io.sockets.adapter.rooms[room].sockets) {
            var socketconnection = io.of("/").connected[socketId];
            if(socketconnection != null && connection.request.decoded_token.user._id != userid && socketconnection.request.decoded_token.user._id == userid ) {
                sendTo(socketconnection,message);
            }
        }
    }

    function broadCastToAll( connection , room , message ) {
        for( var socketId in io.sockets.adapter.rooms[room].sockets) {
            var socketconnection = io.of("/").connected[socketId];
            if(socketconnection != null && connection.request.decoded_token.user._id != socketconnection.request.decoded_token.user._id){
                sendTo(socketconnection,message);
            }
        }
    }

    function sendAllConnectedUsersinRoom( connection , room ) {
        var usersid = [];
        for( var socketId in io.sockets.adapter.rooms[room].sockets) {
            var socketconnection = io.of("/").connected[socketId];
            if(socketconnection != null && connection.request.decoded_token.user._id != socketconnection.request.decoded_token.user._id){
                usersid.push(socketconnection.request.decoded_token.user._id)
            }
        }
        if(usersid.length != 0){
            sendTo(connection,{
                type : "connectedUsers",
                data : usersid
            })
        }
    }
}