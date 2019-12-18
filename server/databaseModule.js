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
  '00', '01','02','03','04', '05', '06', '07', '08', '09', 
  '10', '11','12','13','14', '15', '16', '17', '18', '19',
  '20', '21','22','23','24', '25', '26', '27', '28', '29',
  '30', '31','32','33','34', '35', '36', '37', '38', '39',
  '40', '41','42','43','44', '45', '46', '47', '48', '49',
  '50', '51','52','53','54', '55', '56', '57', '58', '59',
  '60', '61','62','63','64', '65', '66', '67', '68', '69',
  '70', '71','72','73','74', '75', '76', '77', '78', '79',
  '80', '81','82','83','84', '85', '86', '87', '88', '89',
  '90', '91','92','93','94', '95', '96', '97', '98', '99']}, 
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