let db = require('./databaseModule');

async function connexion(pseudo, mdp) {
    const userPromise = await db.findAPlayerByPseudo(pseudo, mdp);
    if (userPromise == "user unknown") {
        db.addAPlayer(pseudo, mdp);
    }
    else if (userPromise == "Mauvais mot de passe") {
        return "Mauvais mot de passe";
    }
    else {
        console.log("Tout est bon");
    }
}

exports.connexion = connexion;