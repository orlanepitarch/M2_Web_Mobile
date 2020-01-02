var server = require('http').createServer();
var io = require('socket.io')(server);
var duo = {};
var waitingUser = new Array();

var login = require("./login");

io.sockets.on('connection', function (socket) {
    console.log('socket connected');
    socket.on('message', function (message,socketID) {
        socket.to(duo[socketID]).emit('message', {message: message});
    }); 

    socket.on('disconnect', function () {
        if (socket.id in duo) {
            socket.to(duo[socket.id]).emit('deconnexionAdversaire', {message: "message"});
            waitingUser.push(duo[socket.id]);
            delete duo[duo[socket.id]];
            delete duo[socket.id];
        }
        else {
            waitingUser = waitingUser.filter(function(player){
                return player != socket.id;
            });
        }
        console.log('socket disconnected');
    });

    socket.on('login', function(pseudo, mdp) {
        login.connexion(pseudo, mdp).then(function (data) {
            if (data == "Mauvais mot de passe") {
                socket.emit("mauvaisMDP");
            }
            else {
                socket.emit("connexionSuccess");
            }
        });
    });

    //liaison des joueurs par leur id de socket
    socket.on('nouveau_client', function(id) {
        if(waitingUser.length > 0) {
            var aLier=waitingUser[0];
            waitingUser = waitingUser.slice(1);
            duo[aLier] = id;
            duo[id] = aLier;
            socket.emit('findAdversaire');
            socket.to(aLier).emit('findAdversaire');
        }
        else {
            waitingUser.push(id);
            socket.emit('waitingAdversaire');
        }
    });
   
});

// port défini arbitrairement (28400 pour éviter les conflits avec les ports fréquemment utilisés)
server.listen(28400);