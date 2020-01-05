var dbMongo = require('./databaseModule');

/**
 * this only use the elo rating formula yet
 * @param {*} blackPlayerPseudo 
 * @param {*} whitePlayerPseudo 
 * @param {*} score 
 */
async function updateRatings(blackPlayerPseudo, whitePlayerPseudo, score){

    game = await dbMongo.findACurrentGameByPlayers(blackPlayerPseudo,whitePlayerPseudo);
    blackPlayer = await dbMongo.findAPlayerByPseudoWithoutPassword(blackPlayerPseudo);
    whitePlayer = await dbMongo.findAPlayerByPseudoWithoutPassword(whitePlayerPseudo);

    /*blackPlayerRating = blackPlayer.rating[blackPlayer.rating.length()-1];
    blackPlayerRatingValue = blackPlayerRating.ratingValue;
    blackPlayerRatingDeviation = blackPlayerRating.ratingDeviation;

    whitePlayerRating = whitePlayer.rating[whitePlayer.rating.length()-1];
    whitePlayerRatingValue = whitePlayerRating.ratingValue;
    whitePlayerRatingDeviation = whitePlayerRating.ratingDeviation;*/

    blackPlayerRating = blackPlayer.rating;
    whitePlayerRating = whitePlayer.rating;

    transformedBlackRating = transformARating(blackPlayerRating);
    transformedWhiteRating = transformARating(whitePlayerRating);

    expectedBlackScore = expectedScore(transformedBlackRating, transformedWhiteRating);
    expectedWhiteScore = expectedScore(transformedWhiteRating, transformedBlackRating);
    
    if(score==1){
        blackScoreValue = 1;
        whiteScoreValue = 0;
    }
    else{
        if(score==-1){
            blackScoreValue=0;
            whiteScoreValue = 1;
        }
        else{//score = 0
            blackScoreValue = 1/2;
            whiteScoreValue = 1/2;
        }
    }

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

exports.updateRatings = updateRatings;