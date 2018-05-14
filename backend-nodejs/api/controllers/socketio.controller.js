//the document that contains the functions of the video/text/voice chat
var socketioJwt = require('socketio-jwt'),
    mongoose = require('mongoose'),
    Session = mongoose.model('Session'),
    config = require('../config/appconfig'),
    Validations = require('../utils/validations');
var users = {};
module.exports = function (io) {
    // Authorize the connection between the two users
    io.set('authorization', socketioJwt.authorize({
        secret: config.SECRET,
        handshake: true
    }));
    //contains all of the protocols that are used to send and recieve packets between the two users
    io.on('connection', function (connection) {
        connection.on('message', function (message) {
            var data;
            try {
                data = JSON.parse(message);
                console.log(connection.request.decoded_token.user._id);
                console.log(data);

            } catch (e) {
                console.log("Invalid JSON");
                data = {};
            }
            switch (data.type) {
                case "Join":
                    if (Validations.isObjectId(data.room)) {
                        Session.findById(data.room, function (err, session) {
                            if (session) {
                                if (isUserAllowedToJoin(session, connection)) {
                                    if (!isUserConnectedinRoom(connection, data.room)) {
                                        connection.join(data.room);
                                        connection.broadcast.to(data.room).emit('message',
                                            JSON.stringify({
                                                type: "Join",
                                                message: "Joined Room " + data.room,
                                                userid: connection.request.decoded_token.user._id
                                            })
                                        )
                                        sendTo(connection,
                                            {
                                                type: "AcceptedInRoom",
                                            }
                                        );
                                        sendAllConnectedUsersinRoom(connection, data.room);
                                    } else {
                                        sendTo(connection,
                                            {
                                                type: "Failure",
                                                message: "Already Logged In Room"
                                            }
                                        );
                                    }
                                } else {
                                    sendTo(connection,
                                        {
                                            type: "Failure",
                                            message: "Not Allowed To Access Session"
                                        }
                                    );
                                }
                            } else {
                                sendTo(connection,
                                    {
                                        type: "Failure",
                                        message: "Unable To Find Session"
                                    }
                                );
                            }
                        });
                    } else {
                        sendTo(connection,
                            {
                                type: "Failure",
                                message: "Not A Valid SessionID"
                            }
                        );
                    }
                    break;
                case "message":
                    connection.broadcast.to(data.room).emit('message',
                        JSON.stringify(
                            {
                                type: "message",
                                message: data.message,
                                userid: connection.request.decoded_token.user._id
                            }
                        )
                    );
                    break;
                case "offer":
                    if (isConnectioninRoom(connection, data.room)) {
                        send_To_Using_ID(connection, data.to, data.room, {
                            type: "offer",
                            offer: data.offer,
                            from: connection.request.decoded_token.user._id,
                        })
                    }
                    break;

                case "answer":
                    if (isConnectioninRoom(connection, data.room)) {
                        send_To_Using_ID(connection, data.to, data.room, {
                            type: "answer",
                            answer: data.answer,
                            from: connection.request.decoded_token.user._id,
                        })
                    }
                    break;

                case "candidate":
                    if (isConnectioninRoom(connection, data.room)) {
                        send_To_Using_ID(connection, data.to, data.room, {
                            type: "candidate",
                            candidate: data.candidate,
                            from: connection.request.decoded_token.user._id,
                        })
                    }
                    break;

                case "close":
                    if (isConnectioninRoom(connection, data.room)) {
                        send_To_Using_ID(connection, data.userid, data.room, {
                            type: "close",
                            from: connection.request.decoded_token.user._id,
                        })
                    }
                    break;

            }
        })

        connection.on('disconnect', function () {
            var rooms = io.sockets.adapter.rooms;
            if (rooms) {
                for (var room in rooms) {
                    if (!rooms[room].hasOwnProperty(room) && Validations.isObjectId(room) ) {
                        connection.broadcast.to(room).emit('message',
                            JSON.stringify(
                                {
                                    type: "disconnected",
                                    userid: connection.request.decoded_token.user._id
                                }
                            )
                        );
                    }
                }
            }
        });
        //connects the call between the two users
        connection.send(JSON.stringify(
            {
                type: "connected"
            }
        ))
    });
    //the functions that sends the protocol messages between the two users
    function sendTo(connection, message) {
        connection.send(JSON.stringify(message));
    }

    function isUserAllowedToJoin(session, connection) {
        if (session.createdById == connection.request.decoded_token.user._id) {
            return true;
        } else {
            for (var i = 0; i < session.users.length; i++) {
                if (session.users[i] == connection.request.decoded_token.user._id) {
                    return true;
                }
            }
        }
        return false;
    }

    function isUserConnectedinRoom(connection, room) {
        if (io.sockets.adapter.rooms[room]) {
            for (var socketId in io.sockets.adapter.rooms[room].sockets) {
                var socketconnection = io.of("/").connected[socketId];
                if (socketconnection != null && connection.request.decoded_token.user._id == socketconnection.request.decoded_token.user._id) {
                    return true;
                }
            }
        }
        return false;
    }

    //check if the users are connected to the room
    function isConnectioninRoom(connection, room) {
        for (var socketId in io.sockets.adapter.rooms[room].sockets) {
            var socketconnection = io.of("/").connected[socketId];
            if (socketconnection == connection) {
                return true;
            }
        }
        return false;
    }
    //sends the protocol message to a certain user that is connected to the session
    function send_To_Using_ID(connection, userid, room, message) {
        for (var socketId in io.sockets.adapter.rooms[room].sockets) {
            var socketconnection = io.of("/").connected[socketId];
            if (socketconnection != null && connection.request.decoded_token.user._id != userid && socketconnection.request.decoded_token.user._id == userid) {
                sendTo(socketconnection, message);
            }
        }
    }

    function disconnect(connection) {
        for (var socketId in io.sockets.connected) {
            if (io.sockets.connected[socketId] == connection) {
                io.sockets.connected[socketId].disconnect();
            }
        }
    }
    //sends the protocol message to all users that are connected to the session
    function broadCastToAll(connection, room, message) {
        for (var socketId in io.sockets.adapter.rooms[room].sockets) {
            var socketconnection = io.of("/").connected[socketId];
            if (socketconnection != null && connection.request.decoded_token.user._id != socketconnection.request.decoded_token.user._id) {
                sendTo(socketconnection, message);
            }
        }
    }
    //sends the info of the users that are connected to the session
    function sendAllConnectedUsersinRoom(connection, room) {
        var usersid = [];
        for (var socketId in io.sockets.adapter.rooms[room].sockets) {
            var socketconnection = io.of("/").connected[socketId];
            if (socketconnection != null && connection.request.decoded_token.user._id != socketconnection.request.decoded_token.user._id) {
                usersid.push(socketconnection.request.decoded_token.user._id)
            }
        }
        if (usersid.length != 0) {
            sendTo(connection, {
                type: "connectedUsers",
                data: usersid
            })
        }
    }
}