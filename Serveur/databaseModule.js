var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var elo = require('./ratingManager');

mongoose.connect('mongodb://127.0.0.1:27017/JeuDeDame', {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {});

/**
 * @typedef Player
 * @type {object}
 * @property {string} pseudo - the player pseudo.
 * @property {Number} rating - the player rating.
 * @property {string} password - the player encrypted password
 * @property {Number} nbWins - his number of wins
 */

/** @type {Player} */

var playerSchema = new mongoose.Schema({
  pseudo: {type: String, minlength:3, maxlength: 15, required:true},
  rating: {type:Number, required:true},
  password: {type:String, required:true},
  nbWins: {type:Number, default:0, min:0, required:true}
});

var Player = mongoose.model('Player', playerSchema);

/**
 * @typedef Game
 * @type {object}
 * @property {String} moves - the sequences of moves of the game.
 * @property {String} whitePlayer - the white player pseudo.
 * @property {String} playerBlack - the black player pseudo.
 * @property {Number} state - the current game state : 
 *                             0 means draw, 1 black win, -1 white win, 2 the game is still played
 * @property {Date} [date] - the game date, automatically inputed by default.
 */

/** @type {Game} */

var gameSchema = new mongoose.Schema({
    moves:[{
      type: String,  enum:[
        '0/0', '0/1','0/2','0/3','0/4', '0/5', '0/6', '0/7', '0/8', '0/9', 
        '1/0', '1/1','1/2','1/3','1/4', '1/5', '1/6', '1/7', '1/8', '1/9',
        '2/0', '2/1','2/2','2/3','2/4', '2/5', '2/6', '2/7', '2/8', '2/9',
        '3/0', '3/1','3/2','3/3','3/4', '3/5', '3/6', '3/7', '3/8', '3/9',
        '4/0', '4/1','4/2','4/3','4/4', '4/5', '4/6', '4/7', '4/8', '4/9',
        '5/0', '5/1','5/2','5/3','5/4', '5/5', '5/6', '5/7', '5/8', '5/9',
        '6/0', '6/1','6/2','6/3','6/4', '6/5', '6/6', '6/7', '6/8', '6/9',
        '7/0', '7/1','7/2','7/3','7/4', '7/5', '7/6', '7/7', '7/8', '7/9',
        '8/0', '8/1','8/2','8/3','8/4', '8/5', '8/6', '8/7', '8/8', '8/9',
        '9/0', '9/1','9/2','9/3','9/4', '9/5', '9/6', '9/7', '9/8', '9/9', "-"], required:true}
    ],
    playerWhite: {type:String, required: true},
    playerBlack: {type:String, required: true},
    state: {type:Number, min:-1, max:2, required:true}, 
    date: {type:Date, default: Date.now, required:true }
});

var Game = mongoose.model('Game', gameSchema);

/**
 * add a player to the database
 * @param {string} Ppseudo - a pseudo
 * @param {string} Ppassword - a password
 */

async function addAPlayer(Ppseudo, Ppassword){
    let hashPassword = await bcrypt.hashSync(Ppassword, 8);
    let newPlayer = new Player({pseudo: Ppseudo, rating: 1500, password: hashPassword });
    newPlayer.save(function (err) {
        if (err) { throw err; }
        else{}
    });
  }

/**
 * add a game to the database, at the current date
 * @param {String} whitePlayer - the white player.
 * @param {String} blackPlayer - the black player.
 */

  function addAGame(whitePlayer, blackPlayer){
     var newGame = new Game({
        moves: [],
        playerWhite: whitePlayer,
        playerBlack: blackPlayer,
        state: 2,
     })
     newGame.save(function (err) {
        if (err) { throw err; }
        else{
        }
    });
 }

  /**
  * find a player by pseudo and password
  * @param {string} thePlayerPseudo - the player pseudo
  * @param {string} password - the player password
  * @return {Player} - the player
  */

 async function findAPlayerByPseudo(thePlayerPseudo, password){
  const user = await Player.findOne({pseudo: thePlayerPseudo});
  if (user) {
    if (await bcrypt.compare(password, user.password)){
      return user;
    }
    //mdp faux :
    else {
      return "Mauvais mot de passe";
    }
  }
  else{ 
      return "user unknown"; 
  }
 }

 /**
  * find a player by pseudo
  * @param {string} thePlayerPseudo -the player pseudo
  * @return {Player} - the player 
  */
 async function findAPlayerByPseudoWithoutPassword(thePlayerPseudo){
   const user = await Player.findOne({pseudo: thePlayerPseudo});
   if(user){
     return user;
   }
   else{
     return "user unknown";
   }
 }

 /**
  * find all the players in the database
  */
 async function findAllPlayers(){
  var res = await Player.find({}, function (err, comms) {
    if (err) { throw err; }
    else{
    }
  });
  return res;
 }

 /**
  * return the password of a given player (by pseudo)
  * @param {number} playerPseudo - the player pseudo
  */

 async function findAPasswordForAGivenPlayerByPseudo(playerPseudo){
    var p = await findAPlayerByPseudo(playerPseudo);
    return p.password;
 }

 /**
  * update a player rating and number of wins
  * @param {string} pPseudo - the player pseudo
  * @param {number} pNewRating - the player rating
  */
  async function updateAPlayerRating(pPseudo, pNewRating){
   player = await findAPlayerByPseudoWithoutPassword(pPseudo);
   player.rating= pNewRating;
   player.save();
 } 

  /**
  * add a move to a current game.
  * @param {string} blackPlayerPseudo - the black player pseudo
  * @param {string} whitePlayerPseudo - the white player pseudo
  * @param {String} startingPosition  - the starting position of the move
  * @param {String} endingPosition - the ending position of the move
  */
 async function addAMoveToACurrentGame(whitePlayerPseudo, blackPlayerPseudo, startingPosition, endingPosition){
  game = await findACurrentGameByPlayers(whitePlayerPseudo, blackPlayerPseudo);
  idNewMove = game.moves.length;
  game.moves.set(idNewMove,startingPosition);
  game.moves.set(idNewMove+1,endingPosition);
  game.save();
}

/**
  * Change the state to indicate the winner, and update the players rating
  * @param {string} whitePlayerPseudo - the white player pseudo
  * @param {string} blackPlayerPseudo - the black player pseudo
  * @param {string} winningSide - the color who won the game (black, white, draw)
*/
 async function addAWinner(whitePlayerPseudo, blackPlayerPseudo, winningSide){
    elo.updateGameAndRatings(blackPlayerPseudo,whitePlayerPseudo,winningSide);
 }
  /**
  * find a game by players involved
  * @param {string} blackPlayerPseudo - the black player pseudo
  * @param {string} whitePlayerPseudo - the white player pseudo
  * @return {Game} - the games
  */

 async function findGamesByPlayers(whitePlayerPseudo, blackPlayerPseudo){
  var game = await Game.find({playerWhite:whitePlayerPseudo, playerBlack:blackPlayerPseudo}, function (err, comms) {
    if (err) { throw err; }
    else{
        return comms;
    }
  });
  return game;
} 

  /**
  * find a game current game involving some given players
  * @param {string} blackPlayerPseudo - the black player pseudo
  * @param {string} whitePlayerPseudo - the white player pseudo
  * @return {Game} - the games
  */

 async function findACurrentGameByPlayers(whitePlayerPseudo, blackPlayerPseudo){
 game = await Game.find({playerWhite: whitePlayerPseudo, playerBlack:blackPlayerPseudo, state: 2}, function (err, comms) {
   if (err) { throw err; }
   else{
       return comms;
   }
 });
 return game[0];
}

exports.addAPlayer = addAPlayer;
exports.addAGame = addAGame;
exports.findAPlayerByPseudo = findAPlayerByPseudo;
exports.findAllPlayers = findAllPlayers;
exports.updateAPlayerRating = updateAPlayerRating;
exports.findGamesByPlayers = findGamesByPlayers;
exports.findAPasswordForAGivenPlayerByPseudo = findAPasswordForAGivenPlayerByPseudo;
exports.findACurrentGameByPlayers = findACurrentGameByPlayers;
exports.addAMoveToACurrentGame = addAMoveToACurrentGame;
exports.findAPlayerByPseudoWithoutPassword = findAPlayerByPseudoWithoutPassword;
exports.addAWinner = addAWinner;