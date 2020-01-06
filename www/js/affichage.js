class Affichage {
    constructor() {
    }

    displayScore(data) {
        let pseudo = data.allPseudos;
        let victoire = data.allNbOfWins;
        let elo = data.allRatings;
        let table = document.getElementById("high-score").querySelector("tbody");
        if(table.childElementCount > 0) {
            table.querySelectorAll('*').forEach(n => n.remove());
        }
        table.parentNode.style.display = "block";
        document.getElementById("displayScore").innerText = "Mettre à jour le tableau des scores";
        for(let i=0;i<pseudo.length;i++) {
            let tr = document.createElement("tr");
            let tdPseudo = document.createElement("td");
            let tdVictoire = document.createElement("td");
            let tdElo = document.createElement("td");
            tdPseudo.innerText = pseudo[i];
            tdVictoire.innerText = victoire[i];
            tdElo.innerText = elo[i];
            tr.append(tdPseudo,tdVictoire,tdElo);
            table.appendChild(tr);
        }
    }

    cancelMatchMaking() {
        document.getElementById('gameType').style.display = "block";
        if (document.getElementById('displayMessage').childElementCount == 1 ) {
            if(document.getElementById("waiting") != null) {
                document.getElementById('displayMessage').removeChild(document.getElementById("waiting"));
            }
        }
        document.getElementById("cancelMatchMaking").style.display = "none";
    }
}