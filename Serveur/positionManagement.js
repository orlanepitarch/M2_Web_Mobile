//permet de renvoyer la position dans le bon sens du damier pour un client (necessaire pour les mouvements adverses) :
function inversePositionMove(detailMove, tailleJeu) {
    let moveAnciennePosition = detailMove.anciennePosition.split("/");
    let moveNouvellePosition =  detailMove.nouvellePosition.split("/");

    let anciennePosition = getNewPos(tailleJeu,moveAnciennePosition[0]) + "/" + getNewPos(tailleJeu,moveAnciennePosition[1]);
    let nouvellePosition = getNewPos(tailleJeu,moveNouvellePosition[0]) + "/" + getNewPos(tailleJeu,moveNouvellePosition[1]);
    return {anciennePosition: anciennePosition, nouvellePosition: nouvellePosition};
}

//calcul la position dans le bon sens du damier pour un client (necessaire pour les mouvements adverses) :
function getNewPos(tailleJeu, position) {
    console.log(parseInt(position));
    return (tailleJeu-1-parseInt(position)).toString();;
}

//permet de renvoyer la position dans le bon sens du damier pour un client (necessaire pour les prises faites par l'adversaire) :
function inversePositionPrise(detailMove, tailleJeu) {
    let priseAnciennePosition = detailMove.anciennePosition.split("/");
    let priseSaute = detailMove.prise.split("/");
    let priseNouvellePosition =  detailMove.nouvellePosition.split("/");

    let anciennePosition = getNewPos(tailleJeu, priseAnciennePosition[0]) + "/" + getNewPos(tailleJeu, priseAnciennePosition[1]);
    let prise = getNewPos(tailleJeu, priseSaute[0]) + "/" + getNewPos(tailleJeu, priseSaute[1]);
    let nouvellePosition =getNewPos(tailleJeu, priseNouvellePosition[0]) + "/" + getNewPos(tailleJeu, priseNouvellePosition[1]);
    return {anciennePosition: anciennePosition, prise: prise, nouvellePosition: nouvellePosition};
}

exports.inversePositionMove = inversePositionMove;
exports.inversePositionPrise = inversePositionPrise;
