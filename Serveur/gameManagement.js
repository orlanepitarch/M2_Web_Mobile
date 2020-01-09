let duoID = {};
let duoPseudo = {};
let waitingUser = new Array();

//renvoie l'id de socket de l'adversaire de l'id de socket du client :
function getDuoSocketID(socketID) {
    if(socketID in duoID) {
        return duoID[socketID];
    }
}

//renvoie un tableau des pseudos blancs et noirs d'après l'id de socket d'un des clients de la partie :
function getPseudoWhiteAndBlack(socketID) {
    let pseudoWhite;
    let pseudoBlack;
    if (duoPseudo[socketID].couleur == "white") {
        pseudoWhite = duoPseudo[socketID].pseudo;
        pseudoBlack = duoPseudo[duoID[socketID]].pseudo;
    }else {
        pseudoWhite = duoPseudo[duoID[socketID]].pseudo;
        pseudoBlack = duoPseudo[socketID].pseudo;
    } 
    return {pseudoWhite: pseudoWhite, pseudoBlack: pseudoBlack};
}

//renvoie la couleur du joueur ayant l'id de socket donné en paramètre :
function getCouleur(socketID) {
    return duoPseudo[socketID].couleur;
}

//modification des listes de parties si un client se déconnecte :
function decoAdversaire(socketID) {
    if(socketID in duoID) {
        waitingUser.push({socketId: duoID[socketID], pseudo: duoPseudo[socketID]});
        delete duoPseudo[duoID[socketID]];
        delete duoPseudo[socketID];
        delete duoID[duoID[socketID]];
        delete duoID[socketID];
    } else {
        waitingUser = waitingUser.filter(function(player){
            return player.socketId != socketID;
        });
    }
}

//modification des listes d'attentes ou de parties à la connection d'un nouvel utilisateur :
function newClient(dataClient) {
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
        return {white: aLier.pseudo, black: pseudo, socketIDAdverse: aLier.socketId};
    }
    else {
        waitingUser.push({socketId: dataClient.socketId, pseudo: dataClient.pseudo});
        return "waiting";
    }
}

//modification de la liste d'attente si un utilisateur annule son attente de match :
function cancelMatchMaking(socketID) {
    waitingUser = waitingUser.filter(function(player){
        return player.socketId != socketID;
    });
}

//modification des listes de parties (is et pseudo) à la victoire d'un nouvel utilisateur :
function win(socketID) {
    delete duoPseudo[duoID[socketID]];
    delete duoPseudo[socketID];
    delete duoID[duoID[socketID]];
    delete duoID[socketID];
}

exports.getDuoSocketID = getDuoSocketID;
exports.getPseudoWhiteAndBlack = getPseudoWhiteAndBlack;
exports.getCouleur = getCouleur;
exports.decoAdversaire = decoAdversaire;
exports.newClient = newClient;
exports.cancelMatchMaking = cancelMatchMaking;
exports.win = win;