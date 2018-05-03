//the document that contains the functions of the video/text/voice chat
var socketioJwt = require('socketio-jwt'),
config = require('../config/appconfig');
var users = {};
module.exports = function (io) {
    // Authorize the connection between the two users
    io.set('authorization', socketioJwt.authorize({
        secret: config.SECRET ,
        handshake: true
      }));
    //contains all of the protocols that are used to send and recieve packets between the two users
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
        // disconnects the call between the two users
        connection.on('disconnect', function () {
            console.log("disconnected " + connection.request.decoded_token.user._id)
            // socket.emit('disconnected');
            // online = online - 1;
        });
        //connects the call between the two users
        connection.send(JSON.stringify(
            {
                type : "connected"
            }
        ))
      });
    //the functions that sends the protocol messages between the two users
    function sendTo(connection, message) {
          console.log("sending to " + connection.request.decoded_token.user._id)
        connection.send(JSON.stringify(message)); 
    }
    //check if the users are connected to the room
    function isConnectioninRoom(connection , room) {
        for( var socketId in io.sockets.adapter.rooms[room].sockets) {
            var socketconnection = io.of("/").connected[socketId];
            if(socketconnection == connection ) {
                return true;
            }
        }
        return false;
    }
//sends the protocol message to a certain user that is connected to the session
    function send_To_Using_ID( connection , userid , room  , message ){
        for( var socketId in io.sockets.adapter.rooms[room].sockets) {
            var socketconnection = io.of("/").connected[socketId];
            if(socketconnection != null && connection.request.decoded_token.user._id != userid && socketconnection.request.decoded_token.user._id == userid ) {
                sendTo(socketconnection,message);
            }
        }
    }
//sends the protocol message to all users that are connected to the session
    function broadCastToAll( connection , room , message ) {
        for( var socketId in io.sockets.adapter.rooms[room].sockets) {
            var socketconnection = io.of("/").connected[socketId];
            if(socketconnection != null && connection.request.decoded_token.user._id != socketconnection.request.decoded_token.user._id){
                sendTo(socketconnection,message);
            }
        }
    }
//sends the info of the users that are connected to the session
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