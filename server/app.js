var server = require('http').createServer();
var io = require('socket.io')(server);
var duoID = {};
var duoPseudo = {};
var waitingUser = new Array();
let db = require('./databaseModule');
var exJoueur = require('./exJoueur');    //TODO à supprimer

var login = require("./login");
var gameManagement = require("./gameManagement");

io.sockets.on('connection', function (socket) {
    console.log('socket connected');


    socket.on('disconnect', function () {
        if (socket.id in duoID) {
            socket.to(duoID[socket.id]).emit('deconnexionAdversaire');
            let couleurGagnante = duoPseudo[duoID[socket.id]].couleur;
            db.addAWinner(couleurGagnante);
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
        db.addAMoveToACurrentGame(pseudoWhite,pseudoBlack, {anciennePosition: detailPrise.anciennePosition, nouvellePosition: detailPrise.nouvellePosition});
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
        db.addAMoveToACurrentGame(pseudoWhite,pseudoBlack, detailMove);
        socket.to(duoID[socketID]).emit('moveAdverse', {detailMove: detailInverse});
    });
    
    socket.on("win", function(dataClient) {
        console.log(dataClient.couleurGagnante + " ont gagné");
        db.addAWinner(dataClient.couleurGagnante);
        delete duoPseudo[duoID[dataClient.socketID]];
        delete duoPseudo[dataClient.socketID];
        delete duoID[duoID[dataClient.socketID]];
        delete duoID[dataClient.socketID.id];
        socket.emit("win", dataClient.couleurGagnante);
    })
});

// port défini arbitrairement (28400 pour éviter les conflits avec les ports fréquemment utilisés)
server.listen(28400);

// TODO à supprimer

async function test(){
    //allPlayers = await dbMongo.findAllPlayers();
    //console.log("nombre de joueurs dans la db = "+allPlayers.length);

    //dbMongo.updateAPlayerRating("Corentin",1670);

    //listeDeCoup = ["1/1","2/2","-","3/3"];
    //listeDeCoup[listeDeCoup.length] = "9/9";
    //console.log(listeDeCoup[listeDeCoup.length-1]);
    //joueurTest = "222";
    //dbMongo.addAGame(listeDeCoup, joueurTest,joueurTest);
    //game = await dbMongo.findACurrentGameByPlayers(joueurTest,joueurTest);
    //console.log("nb coups ="+game.moves.length);
    //console.log("coup 1 = "+game.moves[0]);
    //dbMongo.addAMoveToACurrentGame(joueurTest,joueurTest,"5/5");

    //dbMongo.addAPlayer("user1","user1");
    //dbMongo.addAPlayer("user2","user2");
    //dbMongo.addAGame(["1/1","-"], "user1","user2");
    exJoueur.updateRatings("user1","user2",1);
}

test();
