class log {
    constructor() {
    }

    connexionSuccess() {
        var formulaire = document.getElementById("formConnexion");
        formulaire.style.display = "none";
        if (document.getElementById('displayMessage').childElementCount == 1 ) {
            document.getElementById('displayMessage').removeChild(document.getElementById('mauvaisMDP'));
        }
        document.getElementById('gameType').style.display = "block";
    }
    
    waitingScreen() {
        let p = document.createElement("p");
        p.id = "waiting"
        p.innerHTML = "En attente d'un adversaire";
        document.getElementById("cancelMatchMaking").style.display = "block";
        document.getElementById('displayMessage').appendChild(p);
        document.getElementById('gameType').style.display = "none";
    }
    
    findAdversaire(data){
        let p = document.createElement("p");
        p.id = "adversaire";
        p.innerHTML = "Adversaire trouvé";
        if (document.getElementById('displayMessage').childElementCount == 1 ) {
            if(document.getElementById("waiting") != null) {
                document.getElementById('displayMessage').removeChild(document.getElementById("waiting"));
            }
            document.getElementById("cancelMatchMaking").style.display = "none";
        }
        document.getElementById('displayMessage').appendChild(p);
        document.getElementById('pseudoHaut').innerText = data.black;
        document.getElementById('pseudoBas').innerText = data.white;
        document.getElementById('gameType').style.display = "none";
    }

    adversaireDeco() {
        if (document.getElementById('displayMessage').childElementCount == 1 ) {
            if(document.getElementById("adversaire") != null) {
                document.getElementById('displayMessage').removeChild(document.getElementById("adversaire"));
                document.getElementById('pseudoHaut').innerText = "";
                document.getElementById('pseudoBas').innerText = "";
            }
        }
        this.waitingScreen();
    }

    mauvaisMDP() {
        var p = document.createElement("p");
        p.id = "mauvaisMDP"
        p.innerHTML = "Mauvais mot de passe";
        p.style.color = "red";
        document.getElementById('displayMessage').appendChild(p);
    }
}
