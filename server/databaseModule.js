var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1:27017/test4', {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {});

/**
 * @typedef Player
 * @type {object}
 * @property {string} pseudo - the player pseudo.
 * @property {Number} rating - the player rating.
 * @property {string} password - the player encrypted password
 */

/** @type {Player} */

var playerSchema = new mongoose.Schema({
  pseudo: {type: String, minlength:3, maxlength: 15},
  //rating: {type:ratingSchema}, 
  rating: {type:Number},
  password: {type:String}
});

var Player = mongoose.model('Player', playerSchema);

/**
 * @typedef SquareId
 * @type {object}
 * @property {String} possibleId - the possible id 
 */

 /** @type {SquareId} */

 var squareIdSchema = new mongoose.Schema({
  possibleId: {type: String,  enum:[
   '0/0', '0/1','0/2','0/3','0/4', '0/5', '0/6', '0/7', '0/8', '0/9', 
   '1/0', '1/1','1/2','1/3','1/4', '1/5', '1/6', '1/7', '1/8', '1/9',
   '2/0', '2/1','2/2','2/3','2/4', '2/5', '2/6', '2/7', '2/8', '2/9',
   '3/0', '3/1','3/2','3/3','3/4', '3/5', '3/6', '3/7', '3/8', '3/9',
   '4/0', '4/1','4/2','4/3','4/4', '4/5', '4/6', '4/7', '4/8', '4/9',
   '5/0', '5/1','5/2','5/3','5/4', '5/5', '5/6', '5/7', '5/8', '5/9',
   '6/0', '6/1','6/2','6/3','6/4', '6/5', '6/6', '6/7', '6/8', '6/9',
   '7/0', '7/1','7/2','7/3','7/4', '7/5', '7/6', '7/7', '7/8', '7/9',
   '8/0', '8/1','8/2','8/3','8/4', '8/5', '8/6', '8/7', '8/8', '8/9',
   '9/0', '9/1','9/2','9/3','9/4', '9/5', '9/6', '9/7', '9/8', '9/9']}, 
})

var SquareId = mongoose.model('SquareId', squareIdSchema);

/**
 * @typedef Square
 * @type {object}
 * @property {squareIdSchema} idT - the square id.
 * @property {number} content - the square content following the specification (0 empty, 1 black pawn, 2 black queen, 3 white pawn, 4 white queen).
 */

/** @type {Square} */

var squareSchema = new mongoose.Schema({
  idT: {type: squareIdSchema},
  content: {type: Number, min:0, max: 4}
});

var Square = mongoose.model('Square', squareSchema);

/**
 * @typedef Move
 * @type {object}
 * @property {squareIdSchema} moveSequence - the move sequence.
 */

/** @type {Move} */

var moveSchema = new mongoose.Schema({
    moveSequence: [squareIdSchema]
});

var Move = mongoose.model('Move', moveSchema);

/**
 * @typedef Game
 * @type {object}
 * @property {moveSchema} moves - the sequences of moves of the game.
 * @property {String} whitePlayer - the white player pseudo.
 * @property {String} playerBlack - the black player pseudo.
 * @property {Number} state - the current game state : 
 *                             0 means draw, 1 black win, -1 white win, 2 the game is still played
 * @property {Date} [date] - the game date, automatically inputed by default.
 */

/** @type {Game} */

var gameSchema = new mongoose.Schema({
    moves: [moveSchema],
    playerWhite: String,
    playerBlack: String,
    state: {type:Number, min:-1, max:2},
    date: {type:Date, default: Date.now}
});

var Game = mongoose.model('Game', gameSchema);

/**
 * @typedef Rating
 * @type {object}
 * @property {RatingWithPeriod} seqOfRatings -the sequence of rating
 */

 /** @type {Rating} */

/*var ratingSchema = new mongoose.Schema({
  seqOfRatings: [RatingWithPeriodSchema]
})

var Rating = mongoose.model('Rating', ratingSchema);*/

/**
 * @typedef seqOfRating
 * @type {object}
 * @property {number} ratingValue - the value of the rating
 * @property {number} ratingDeviation - the deviation of the rating
 * @property {Date} date - the period of the rating
 */

 /** @type {SeqOfRating} */
/* var seqOfRatingsSchema = new mongoose.Schema({
 ratingValue: number,
 ratingDeviation: number,
 date: Date,
})*/

//var SeqOfRating = mongoose.model('SeqOfRating', seqOfRatingsSchema);

/**
 * add a player to the database
 * @param {number} Pid - an id
 * @param {string} Ppseudo - a pseudo
 * @param {number} Prating - a rating
 * @param {string} Ppassword - a password
 */

async function addAPlayer(Ppseudo, Ppassword){
    let hashPassword = await bcrypt.hashSync(Ppassword, 8);
    //let initialRatingSequence = new SeqOfRating({ratingValue: 1500, ratingDeviation: 350, date:Date.now()});
    //let initialRating = new Rating({seqOfRatings:initialRatingSequence});
    let newPlayer = new Player({pseudo: Ppseudo, rating: 1500, password: hashPassword });
    newPlayer.save(function (err) {
        if (err) { throw err; }
        else{
          console.log(newPlayer.pseudo + ' ajouté avec succès');
        }
    });
  }

/**
 * add a game to the database, at the current date
 * @param {moveSchema} seqMove - the sequences of moves of the game.
 * @param {String} whitePlayer - the white player.
 * @param {String} blackPlayer - the black player.
 */

  function addAGame(seqMove, whitePlayer, blackPlayer){
     var newGame = new Game({
        moves: seqMove,
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
  * update a player rating
  * @param {string} pPseudo - the player pseudo
  * @param {number} pNewRating, - the player rating
  */
  async function updateAPlayerRating(pPseudo, pNewRating){
   player = await findAPlayerByPseudoWithoutPassword(pPseudo);
   player.rating= pNewRating;
   player.save();
 } 

 /**
  * update a player rating
  * @param {string} pPseudo - the player pseudo
  * @param {number} pNewRatingValue, - the player rating value
  * @param {number} pNewRatingDeviation -the player rating deviation
  * @param {boolean} isItANewSequence - true if it's a new rating sequence
  */
 /* function updateAPlayerRating(pPseudo, pNewRatingValue, pNewRatingDeviation, isItANewSequence){
   player = findAPlayerByPseudo(pPseudo);
   if(isItANewSequence){
    let newSeqOfRating = new seqOfRatings({
      ratingValue: pNewRatingValue,
      ratingDeviation: pNewRatingDeviation,
      date: Date.now()
    })
    player.rating = player.rating+newSeqOfRating;
   }
   else{
    lastRating = player.rating[player.rating.length()-1];
    lastRating.ratingValue = pNewRatingValue;
    lastRating.ratingDeviation = pNewRatingDeviation;
   }
   player.save();
 } */

  /**
  * add a move to a current game.
  * @param {string} blackPlayerPseudo - the black player pseudo
  * @param {string} whitePlayerPseudo - the white player pseudo
  * @param {Move} move - the move 
  */
 async function addAMoveToACurrentGame(blackPlayerPseudo, whitePlayerPseudo, move){
  game = await findACurrentGameByPlayers(blackPlayer,whitePlayer);
  game.moves = game.moves+move;
  game.save();
}

  /**
  * find a game by players involved
  * @param {string} blackPlayerPseudo - the black player pseudo
  * @param {string} whitePlayerPseudo - the white player pseudo
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

  /**
  * find a game current game involving some given players
  * @param {string} blackPlayerPseudo - the black player pseudo
  * @param {string} whitePlayerPseudo - the white player pseudo
  * @return {Game} - the games
  */

 function findACurrentGameByPlayers(blackPlayerPseudo, whitePlayerPseudo){
  blackPlayer = findAPlayerByPseudo(blackPlayerPseudo);
  whitePlayer = findAPlayerByPseudo(whitePlayerPseudo);

 Game.find({playerWhite: whitePlayer, playerBlack:blackPlayer, state: 2}, function (err, comms) {
   if (err) { throw err; }
   else{
       return comms;
   }
 });
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