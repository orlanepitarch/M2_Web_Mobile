var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {});

/**
 * @typedef Player
 * @type {object}
 * @property {number} id - the player ID.
 * @property {string} pseudo - the player pseudo.
 * @property {number} rating - the player rating.
 * @property {string} password - the player encrypted password
 */

/** @type {Player} */

var playerSchema = new mongoose.Schema({
  id: {type:Number, min:0},
  pseudo: {type: String, minlength:3, maxlength: 15},
  rating: {type:Number, min:0}, 
  password: {type:String}
});

var Player = mongoose.model('Player', playerSchema);

/**
 * @typedef Square
 * @type {object}
 * @property {string} id - the square id.
 * @property {number} content - the square content following the specification (0 empty, 1 black pawn, 2 black queen, 3 white pawn, 4 white queen).
 */

/** @type {Square} */

var squareSchema = new mongoose.Schema({
  id: {type: String,  enum:[
  'A1','A2','A3','A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 
  'B1','B2','B3','B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10',
  'C1','C2','C3','C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10',
  'D1','D2','D3','D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10',
  'E1','E2','E3','E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10',
  'F1','F2','F3','F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10',
  'G1','G2','G3','G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10',
  'H1','H2','H3','H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10',
  'I1','I2','I3','I4', 'I5', 'I6', 'I7', 'I8', 'I9', 'I10',
  'J1','J2','J3','J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'J10']}, 
  content: {type: Number, min:0, max: 4}
});

var Square = mongoose.model('Square', squareSchema);

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

/**
 * add a player to the database
 * @param {number} Pid - an id
 * @param {string} Ppseudo - a pseudo
 * @param {number} Prating - a rating
 * @param {string} Ppassword - a password
 */

function addAPlayer(Pid, Ppseudo, Prating){
    var newPlayer = new Player({ id: Pid, pseudo: Ppseudo, rating:Prating, password:Ppassword });
    newPlayer.save(function (err) {
        if (err) { throw err; }
        else{
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
  * return the password of a given player (by id)
  * @param {number} playerId - the player id
  */

 function findAPasswordForAGivenPlayerById(playerId){
    var p = findAPlayerById(playerId);
    return p.password;
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
exports.findAPasswordForAGivenPlayerById = findAPasswordForAGivenPlayerById;