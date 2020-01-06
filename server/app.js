var server = require('http').createServer();
var io = require('socket.io')(server);
var duoID = {};
var duoPseudo = {};
var waitingUser = new Array();
var db = require('./databaseModule');
var ratingManager = require('./ratingManager');

var login = require("./login");
var gameManagement = require("./gameManagement");

io.sockets.on('connection', function (socket) {
    console.log('socket connected');

    socket.on('disconnect', function () {
        if (socket.id in duoID) {
            socket.to(duoID[socket.id]).emit('deconnexionAdversaire');
            let couleurGagnante = duoPseudo[socket.id].couleur;
            let pseudoWhite;
            let pseudoBlack;
            if (duoPseudo[socket.id].couleur == "white") {
                pseudoWhite = duoPseudo[socket.id].pseudo;
                pseudoBlack = duoPseudo[duoID[socket.id]].pseudo;
            }else {
                pseudoWhite = duoPseudo[duoID[socket.id]].pseudo;
                pseudoBlack = duoPseudo[socket.id].pseudo;
            } 
            db.addAWinner(pseudoWhite, pseudoBlack, couleurGagnante);
            waitingUser.push({socketId: duoID[socket.id], pseudo: duoPseudo[socket.id]});
            delete duoPseudo[duoID[socket.id]];
            delete duoPseudo[socket.id];
            delete duoID[duoID[socket.id]];
            delete duoID[socket.id];
        }
        else {
            waitingUser = waitingUser.filter(function(player){
                return player.socketId != socket.id;
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
                socket.emit("connexionSuccess", {pseudo: pseudo});
            }
        });
    });

    //liaison des joueurs par leur id de socket
    socket.on('nouveau_client', function(dataClient) {
        if(waitingUser.length > 0 && waitingUser[0] == undefined) {
            waitingUser = waitingUser.slice(1);
        }
        if(waitingUser.length > 0) {
            let socketID = dataClient.socketId;
            let pseudo = dataClient.pseudo;
            let aLier=waitingUser[0];
            waitingUser = waitingUser.slice(1);
            duoID[aLier.socketId] = socketID;
            duoPseudo[aLier.socketId] = {pseudo: pseudo, couleur: "black"};
            duoID[socketID] = aLier.socketId;
            duoPseudo[socketID] =  {pseudo: aLier.pseudo, couleur: "white"};
            db.addAGame(aLier.pseudo, pseudo);
            socket.emit('findAdversaire', {white: aLier.pseudo, black: pseudo});
            socket.to(aLier.socketId).emit('findAdversaire', {white: aLier.pseudo, black: pseudo});
        }
        else {
            waitingUser.push({socketId: dataClient.socketId, pseudo: dataClient.pseudo});
            socket.emit('waitingAdversaire');
        }
    });

    socket.on("cancelMatchMaking", function() {
        waitingUser = waitingUser.filter(function(player){
            return player.socketId != socket.id;
        });
    });

    socket.on('priseAdverse', function(detailPrise, tailleJeu, socketID) {
        let detailInverse = gameManagement.inversePositionPrise(detailPrise, tailleJeu);
        let pseudoWhite;
        let pseudoBlack;
        if (duoPseudo[socketID].couleur == "white") {
            pseudoWhite = duoPseudo[socketID].pseudo;
            pseudoBlack = duoPseudo[duoID[socketID]].pseudo;
        }else {
            pseudoWhite = duoPseudo[duoID[socketID]].pseudo;
            pseudoBlack = duoPseudo[socketID].pseudo;
        } 
        db.addAMoveToACurrentGame(pseudoWhite,pseudoBlack, detailPrise.anciennePosition, detailPrise.nouvellePosition);
        socket.to(duoID[socketID]).emit('priseAdverse', {detailPrise: detailInverse});
    });

    socket.on('moveAdverse', function(detailMove, tailleJeu, socketID) {
        let detailInverse = gameManagement.inversePositionMove(detailMove, tailleJeu);
        let pseudoWhite;
        let pseudoBlack;
        if (duoPseudo[socketID].couleur == "white") {
            pseudoWhite = duoPseudo[socketID].pseudo;
            pseudoBlack = duoPseudo[duoID[socketID]].pseudo;
        }else {
            pseudoWhite = duoPseudo[duoID[socketID]].pseudo;
            pseudoBlack = duoPseudo[socketID].pseudo;
        } 
        db.addAMoveToACurrentGame(pseudoWhite,pseudoBlack, detailMove.anciennePosition, detailMove.nouvellePosition);
        socket.to(duoID[socketID]).emit('moveAdverse', {detailMove: detailInverse});
    });
    
    socket.on("win", function(dataClient) {
        let pseudoWhite;
        let pseudoBlack;
        if (duoPseudo[dataClient.socketID].couleur == "white") {
            pseudoWhite = duoPseudo[dataClient.socketID].pseudo;
            pseudoBlack = duoPseudo[duoID[dataClient.socketID]].pseudo;
        }else {
            pseudoWhite = duoPseudo[duoID[dataClient.socketID]].pseudo;
            pseudoBlack = duoPseudo[dataClient.socketID].pseudo;
        } 
        db.addAWinner(pseudoWhite, pseudoBlack, dataClient.couleurGagnante);
        delete duoPseudo[duoID[dataClient.socketID]];
        delete duoPseudo[dataClient.socketID];
        delete duoID[duoID[dataClient.socketID]];
        delete duoID[dataClient.socketID.id];
        socket.emit("win", dataClient.couleurGagnante);
    })

    socket.on("displayScore", function() {
        ratingManager.findTheXBestPlayers(10).then(function(highScore) {
            socket.emit("displayScore", highScore);
        })
    })
});

// port défini arbitrairement (28400 pour éviter les conflits avec les ports fréquemment utilisés)
server.listen(28400);

