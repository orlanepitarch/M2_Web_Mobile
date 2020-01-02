class log {
    constructor() {
    }

    connexionSuccess() {
        var formulaire = document.getElementById("formConnexion");
        formulaire.style.display = "none";
        if (document.getElementById('displayMessage').childElementCount == 1 ) {
            document.getElementById('displayMessage').removeChild(document.getElementById('mauvaisMDP'));
        }
        
    }
    
    waitingScreen() {
        var p = document.createElement("p");
        p.id = "waiting"
        p.innerHTML = "En attente d'un adversaire";
        document.getElementById('displayMessage').appendChild(p);
    }
    
    findAdversaire(){
        var p = document.createElement("p");
        p.innerHTML = "Adversaire trouvé";
        if (document.getElementById('displayMessage').childElementCount == 1 ) {
            if(document.getElementById("waiting") != null) {
                document.getElementById('displayMessage').removeChild(document.getElementById("waiting"));
            }
        }
        document.getElementById('displayMessage').appendChild(p);
        
    }

    mauvaisMDP() {
        var p = document.createElement("p");
        p.id = "mauvaisMDP"
        p.innerHTML = "Mauvais mot de passe";
        p.style.color = "red";
        document.getElementById('displayMessage').appendChild(p);
    }
}
