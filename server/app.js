var server = require('http').createServer();
var io = require('socket.io')(server);

io.sockets.on('connection', function (socket) {
    console.log('socket connected');
    socket.on('message', function (message) {
        socket.broadcast.emit('message', {message: message});
    }); 

    socket.on('disconnect', function () {
        console.log('socket disconnected');
    });

    
});

// port défini arbitrairement (28400 pour éviter les conflits avec les ports fréquemment utilisés)
server.listen(28400);