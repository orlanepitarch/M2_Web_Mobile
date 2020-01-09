let db = require('./databaseModule');

// appelle la fonction de la base de données puis retourne ce qu'il faut à app.js en fonction du retour de cette fonction ;
async function connexion(pseudo, mdp) {
    const userPromise = await db.findAPlayerByPseudo(pseudo, mdp);
    if (userPromise == "user unknown") {
        db.addAPlayer(pseudo, mdp);
    }
    else if (userPromise == "Mauvais mot de passe") {
        return "Mauvais mot de passe";
    }
}

exports.connexion = connexion;