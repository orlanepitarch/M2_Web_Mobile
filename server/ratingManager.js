var dbMongo = require('./databaseModule');

/**
 * update a game state and the involved player rating, once the game is over.
 * @param {string} blackPlayerPseudo - the black player pseudo
 * @param {string} whitePlayerPseudo - the white player pseudo
 * @param {string} score - the score of the game, or winning side : "black", "white" or "draw".
 */
async function updateGameAndRatings(blackPlayerPseudo, whitePlayerPseudo, score){
    game = await dbMongo.findACurrentGameByPlayers(whitePlayerPseudo, blackPlayerPseudo);
    blackPlayer = await dbMongo.findAPlayerByPseudoWithoutPassword(blackPlayerPseudo);
    whitePlayer = await dbMongo.findAPlayerByPseudoWithoutPassword(whitePlayerPseudo);

    blackPlayerRating = blackPlayer.rating;
    whitePlayerRating = whitePlayer.rating;

    transformedBlackRating = transformARating(blackPlayerRating);
    transformedWhiteRating = transformARating(whitePlayerRating);

    expectedBlackScore = expectedScore(transformedBlackRating, transformedWhiteRating);
    expectedWhiteScore = expectedScore(transformedWhiteRating, transformedBlackRating);
    
    if(score=="black"){
        blackScoreValue = 1;
        whiteScoreValue = 0;
        game.state=1;
        blackPlayer.nbWins = blackPlayer.nbWins+1;
        blackPlayer.save();
    }
    else{
        if(score=="white"){
            blackScoreValue=0;
            whiteScoreValue = 1;
            game.state=-1;
            whitePlayer.nbWins = whitePlayer.nbWins+1;
            whitePlayer.save();
        }
        else{//draw
            blackScoreValue = 1/2;
            whiteScoreValue = 1/2;
            game.state=0;
        }
    }
    game.save();

    newBlackPlayerRating = calculateNewRating(blackPlayerRating,32,blackScoreValue,expectedBlackScore);
    newWhitePlayerRating = calculateNewRating(whitePlayerRating,32,whiteScoreValue,expectedWhiteScore);

    dbMongo.updateAPlayerRating(blackPlayerPseudo,newBlackPlayerRating);
    dbMongo.updateAPlayerRating(whitePlayerPseudo,newWhitePlayerRating);
}

function transformARating(rating){
    return Math.pow(10,(rating/400));
}

function expectedScore(consideredPlayerTransformedRating, opponentTransformedRating){
    return consideredPlayerTransformedRating/(consideredPlayerTransformedRating+opponentTransformedRating);
}

function calculateNewRating(ratingValue, KFactorValue, score, expectedScore){
    return ratingValue + KFactorValue*(score-expectedScore);
}

/**
 * find the X best players, by their number of wins
 * @param {number} x, the number of players wanted. If x is greater than the number of player, then it simply sort all players. 
 * @return an array of arrays (allPseudos, allNbOfWins, allRatings), containing the sorted values.
 */
async function findTheXBestPlayers(x){
    allPlayers = await dbMongo.findAllPlayers();
    allPseudos = [];
    allNbOfWins = [];
    allRatings = [];
  
    if(x<1){
      return "error ! x can't be <1";
    }
  
    j = 0 ;  
    while((j!=x)&&(allPlayers.length!=0)){
      iMax = 0 ;
      nbWinsMax=allPlayers[0].nbWins;
      i=1 ;
  
      while(i!=allPlayers.length){
        if((allPlayers[i].nbWins)>nbWinsMax){
          iMax = i;
          nbWinsMax = allPlayers[i];
        }
        i=i+1
      }
      allPseudos[j]=allPlayers[iMax].pseudo;
      allNbOfWins[j]=allPlayers[iMax].nbWins;
      allRatings[j]=allPlayers[iMax].rating;
      allPlayers.splice(iMax,1);
      j=j+1;
    }
  
    let result= [];
    result.allPseudos = allPseudos;
    result.allNbOfWins = allNbOfWins;
    result.allRatings = allRatings;
  
    return result;
  }

exports.updateGameAndRatings = updateGameAndRatings;
exports.findTheXBestPlayers = findTheXBestPlayers;