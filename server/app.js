var server = require('http').createServer();
var io = require('socket.io')(server);
var db = require('./databaseModule');
var ratingManager = require('./ratingManager');
var login = require("./login");
var positionManagement = require("./positionManagement");
var gameManagement = require("./gameManagement");

io.sockets.on('connection', function (socket) {
    console.log('socket connected');

    //si un client se déconnecte, on doit prévenir son adversaire et le faire gagner ou l'enlever de la liste d'attente :
    socket.on('disconnect', function () {
        let adversaire = gameManagement.getDuoSocketID(socket.id);
        if (adversaire) {
            socket.to(adversaire).emit('deconnexionAdversaire');
            let pseudoCouleur =  gameManagement.getPseudoWhiteAndBlack(socket.id);
            let couleurGagnante = gameManagement.getCouleur(socket.id);
            db.addAWinner(pseudoCouleur.pseudoWhite, pseudoCouleur.pseudoBlack, couleurGagnante);
        } 
        gameManagement.decoAdversaire(socket.id);
        console.log('socket disconnected');
    });

    //Si un client se connecte, on lui indique si son mot de passe est mauvais, si tout est bon on l'indique :
    socket.on('login', function(pseudo, mdp) {
        login.connexion(pseudo, mdp).then(function (data) {
            if (data == "Mauvais mot de passe") {
                socket.emit("mauvaisMDP");
            } else {
                socket.emit("connexionSuccess", {pseudo: pseudo});
            }
        });
    });

    //liaison des joueurs par leur id de socket :
    socket.on('nouveau_client', function(dataClient) {
        let retour = gameManagement.newClient(dataClient);
        if (retour == "waiting") {
            socket.emit('waitingAdversaire');
        } else {
            db.addAGame(retour.white, retour.black);
            socket.emit('findAdversaire', {white: retour.white, black: retour.black});
            socket.to(retour.socketIDAdverse).emit('findAdversaire', {white: retour.white, black: retour.black});
        }
    });

    //annulation de l'attente de partie d'un joueur :
    socket.on("cancelMatchMaking", function() {
        gameManagement.cancelMatchMaking(socket.id);
    });

    //renvoi à l'adversaire du coup fait (dans le bon sens de plateau):
    socket.on('priseAdverse', function(detailPrise, tailleJeu, socketID) {
        let detailInverse = positionManagement.inversePositionPrise(detailPrise, tailleJeu);
        let pseudos = gameManagement.getPseudoWhiteAndBlack(socketID);
        db.addAMoveToACurrentGame(pseudos.pseudoWhite, pseudos.pseudoBlack, detailPrise.anciennePosition, detailPrise.nouvellePosition);
        socket.to(gameManagement.getDuoSocketID(socketID)).emit('priseAdverse', {detailPrise: detailInverse});
    });

    //renvoi à l'adversaire du coup fait (dans le bon sens de plateau):
    socket.on('moveAdverse', function(detailMove, tailleJeu, socketID) {
        let detailInverse = positionManagement.inversePositionMove(detailMove, tailleJeu);
        let pseudos = gameManagement.getPseudoWhiteAndBlack(socketID);
        db.addAMoveToACurrentGame(pseudos.pseudoWhite, pseudos.pseudoBlack, detailMove.anciennePosition, detailMove.nouvellePosition);
        socket.to(gameManagement.getDuoSocketID(socketID)).emit('moveAdverse', {detailMove: detailInverse});
    });
    
    //si victoire d'une couleur, on l'indique à la base de données, aux clients et à la gestion des parties :
    socket.on("win", function(dataClient) {
        let pseudos = gameManagement.getPseudoWhiteAndBlack(dataClient.socketID);
        db.addAWinner(pseudos.pseudoWhite, pseudos.pseudoBlack, dataClient.couleurGagnante);
        gameManagement.win(dataClient.socketID);
        socket.emit("win", dataClient.couleurGagnante);
    });

    //si l'utilisateur veut voir le score, on appelle la fonction renvoyant les X meilleurs scores :
    socket.on("displayScore", function() {
        ratingManager.findTheXBestPlayers(10).then(function(highScore) {
            socket.emit("displayScore", highScore);
        })
    })
});

// port défini arbitrairement (28400 pour éviter les conflits avec les ports fréquemment utilisés)
server.listen(28400);

