var server = require('http').createServer();
var io = require('socket.io')(server);
var duo = {};
var waitingUser = new Array();

io.sockets.on('connection', function (socket) {
    console.log('socket connected');
    socket.on('message', function (message,socketID) {
        console.log(socketID);
        socket.to(duo[socketID]).emit('message', {message: message});
    }); 

    socket.on('disconnect', function () {
        console.log('socket disconnected');
    });

    socket.on('nouveau_client', function(id) {
        if(waitingUser.length > 0) {
            var aLier=waitingUser[0];
            waitingUser = waitingUser.slice(1);
            duo[aLier] = id;
            duo[id] = aLier;
        }
        else {
            waitingUser.push(id);
        }
    });
   
});

// port défini arbitrairement (28400 pour éviter les conflits avec les ports fréquemment utilisés)
server.listen(28400);