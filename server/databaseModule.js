var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  //console.log("connecté!");
});

/**
 * @typedef Player
 * @type {object}
 * @property {number} id - the player ID.
 * @property {string} pseudo - the player pseudo.
 * @property {number} rating - the player rating.
 */

/** @type {Player} */

var playerSchema = new mongoose.Schema({
  id: {type:Number, min:0},
  pseudo: {type: String, minlength:3, maxlength: 15},
  rating: {type:Number, min:0} 
});

var Player = mongoose.model('Player', playerSchema);

//var Corentin = new Player({ id: 1, pseudo: "Corentin", rating:2000 });
//var Victor = new Player({ id: 2, pseudo: "Victor", rating:2001 });
//var Orlane = new Player({ id: 3, pseudo: "Orlane", rating:2200 });
//var Quentin = new Player({ id: 4, pseudo: "Quentin", rating:1999 });

/**
 * @typedef Square
 * @type {object}
 * @property {string} id - the square id.
 * @property {number} content - the square content following the specification (0 empty, 1 black pawn, 2 black queen, 3 white pawn, 4 white queen).
 */

/** @type {Square} */

var squareSchema = new mongoose.Schema({
  id: {type: String,  enum:['A1','A2','A3','A4']}, //TODO extends values
  content: {type: Number, min:0, max: 4}
});

var Square = mongoose.model('Square', squareSchema);

var A1 = new Square({ id: 'A1', content:0 });
var A2 = new Square({ id: 'A2', content:0 });
var A3 = new Square({ id: 'A3', content:0 });
var A4 = new Square({ id: 'A4', content:0 });


/*var boardSchema = new mongoose.Schema({
    board: [squareSchema],
    player: playerSchema,
    date: {type:Date, default: Date.now}
});

var Board = mongoose.model('Board', boardSchema); */

/**
 * @typedef Move
 * @type {object}
 * @property {squareSchema} moveSequence - the move sequence.
 */

/** @type {Move} */

var moveSchema = new mongoose.Schema({
    moveSequence: [squareSchema]
});

var Move = mongoose.model('Move', moveSchema);

/**
 * @typedef Game
 * @type {object}
 * @property {moveSchema} moves - the sequences of moves of the game.
 * @property {Player} whitePlayer - the white player.
 * @property {Player} playerBlack - the black player.
 * @property {Date} [date] - the game date, automatically inputed by default.
 */

/** @type {Game} */

var gameSchema = new mongoose.Schema({
    moves: [movesSchema],
    playerWhite: playerSchema,
    playerBlack: playerSchema,
    date: {type:Date, default: Date.now}
});

var Game = mongoose.model('Game', gameSchema);

/*var game1 = new Board({
    board: [{}],
    player: Corentin,
});*/

/*function addPlayers(){
Corentin.save(function (err) {
  if (err) { throw err; }
  else {
    console.log(' Corentin ajouté avec succès !');
    Victor.save(function (err) {
      if (err) { throw err; }
      else{
        console.log(' Victor ajouté avec succès !');
        Orlane.save(function (err) {
          if (err) { throw err; }
          else{
            console.log(' Orlane ajouté avec succès !');
            Quentin.save(function (err) {
              if (err) { throw err; }
              else{
                console.log(' Quentin ajouté avec succès !');
                findPlayer();
                addSquare();
              }
            });
          }
        });
      }
    });
  }
}); 
} */

/*function findPlayer(){
  Player.find({pseudo: "Orlane"}, function (err, comms) {
    if (err) { throw err; }
    else{
        // comms est un tableau de hash
        console.log("resultat du find : "+comms);
    }
  });
}*/

/* function addSquare(){
A1.save(function (err) {
  if (err) { throw err; }
  else {
    console.log(' A1 ajouté avec succès !');
    A2.save(function (err) {
      if (err) { throw err; }
      else{
        console.log(' A2 ajouté avec succès !');
        A3.save(function (err) {
          if (err) { throw err; }
          else{
            console.log(' A3 ajouté avec succès !');
            A4.save(function (err) {
              if (err) { throw err; }
              else{
                console.log(' A4 ajouté avec succès !');
                addBoard();
              }
            });
          }
        });
      }
    });
  }
});   
          
}*/

/** function addBoard(){
  game1.save(function (err) {
    if (err) { throw err; }
    else{
      console.log(' game1 ajouté avec succès !');
      findBoard();
    }
  });
}

function findBoard(){
Board.find({}, function (err, comms) {
  if (err) { throw err; }
  else{
      // comms est un tableau de hash
      console.log("resultat du find : "+comms);
  }
});
} */

/**
 * add a player to the database
 * @param {number} Pid - an id
 * @param {string} Ppseudo - a pseudo
 * @param {number} Prating - a rating
 */
function addAPlayer(Pid, Ppseudo, Prating){
    var newPlayer = new Player({ id: Pid, pseudo: Ppseudo, rating:Prating });
    newPlayer.save(function (err) {
        if (err) { throw err; }
        else{
          console.log(newPlayer.pseudo+" ajouté avec succès !");
        }
    });
}

/**
 * add a game to the database
 * @param {moveSchema} seqMove - the sequences of moves of the game.
 * @param {Player} whitePlayer - the white player.
 * @param {Player} playerBlack - the black player.
 * @param {Date} date - the game date.
 */

 function addAGame(seqMove, whitePlayer, blackPlayer, date){
     var newGame = new Game({
        moves: seqMove,
        playerWhite: whitePlayer,
        playerBlack: blackPlayer,
        date: date
     })
     newGame.save(function (err) {
        if (err) { throw err; }
        else{
          console.log(newGame.playerWhite.pseudo +" vs "+newGame.playerBlack.pseudo+ " ajouté avec succès");
        }
    });
 }

 /**
  * find a player by id
  * @param {number} thePlayerId - the player id
  * @return {Player} - the player
  */

 function findAPlayerById(thePlayerId){
  Player.find({id: thePlayerId}, function (err, comms) {
    if (err) { throw err; }
    else{
        return comms;
    }
  });
 }

  /**
  * find a player by pseudo
  * @param {string} thePlayerPseudo - the player pseudo
  * @return {Player} - the player
  */

 function findAPlayerByPseudo(thePlayerPseudo){
  Player.find({pseudo: thePlayerPseudo}, function (err, comms) {
    if (err) { throw err; }
    else{
        return comms;
    }
  });
 }

 /**
  * find all the players in the database
  */
 function findAllPlayers(){
  Player.find({}, function (err, comms) {
    if (err) { throw err; }
    else{
        return comms;
    }
  });
 }

 /**
  * update a player rating and find him by id
  * @param {number} thePlayerId - the player id
  * @param {number} thePlayerNewRating - the player rating
  */
 function updateAPlayerRatingAndFindHimById(thePlayerId, thePlayerNewRating){
   player = findAPlayerById(thePlayerId);
   player.rating=thePlayerNewRating;
   player.save();
 }

  /**
  * find a game by players involved
  * @param {Player} blackPlayerPseudo - the black player pseudo
  * @param {Player} whitePlayerPseudo - the white player pseudo
  * @return {Game} - the games
  */

 function findGamesByPlayers(blackPlayerPseudo, whitePlayerPseudo){
   blackPlayer = findAPlayerByPseudo(blackPlayerPseudo);
   whitePlayer = findAPlayerByPseudo(whitePlayerPseudo);

  Game.find({playerWhite: whitePlayer, playerBlack:blackPlayer}, function (err, comms) {
    if (err) { throw err; }
    else{
        return comms;
    }
  });
 } 

exports.addAPlayer = addAPlayer;
exports.addAGame = addAGame;
exports.findAPlayerById = findAPlayerById;
exports.findAPlayerByPseudo = findAPlayerByPseudo;
exports.findAllPlayers = findAllPlayers;
exports.updateAPlayerRatingAndFindHimById = updateAPlayerRatingAndFindHimById;
exports.findGamesByPlayers = findGamesByPlayers;