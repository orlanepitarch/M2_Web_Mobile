var server = require('http').createServer();
var io = require('socket.io')(server);

io.sockets.on('connection', function (socket) {
    console.log('socket connected');

    socket.on('disconnect', function () {
        console.log('socket disconnected');
    });

    socket.emit('text', 'Socket Emise'); 
});

// port défini arbitrairement (28400 pour éviter les conflits avec les ports fréquemment utilisés)
server.listen(28400);