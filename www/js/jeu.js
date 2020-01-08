
class Game {
    /*constructor(event){
        this.event = event;
        this.displayDamier();
        makeDraggable();
    }*/
    constructor(gameType, couleurJoueur) {
        this.selectedPion, this.caseActive, this.caseChoisie;
        this.caseOptions = [];
        this.casePrises = new Map();
        this.tailleDamier = 10;
        this.couleurJoueur = couleurJoueur;
        console.log("Joueur "+this.couleurJoueur);
        this.tourJoueur = "white";
        console.log("Tour "+this.tourJoueur);
        document.getElementById("damier").style.border = "5px solid white";
        this.gameType = gameType;
        this.tailleCase = (100/parseInt(this.tailleDamier));
    
        new Damier(this.tailleDamier, this.couleurJoueur);
        this.makeDraggable(document.getElementById("damier"));
    }

    makeDraggable(event) {
        let damier = event;
        damier.addEventListener('mousedown', (event) => {
            this.clickedPion(event);
        });
        damier.addEventListener('mouseup', (event) => {
            this.releasePion(event);
        });
        damier.addEventListener('touchstart', (event) => {
            this.clickedPion(event);
        });
        damier.addEventListener('touchleave',(event) => {
            this.releasePion(event);
        });
    }
    
    clickedPion(event) {
        //enlève les indicateurs pour les mobiles :
        if (document.querySelectorAll('.indicator') != null) {
            document.querySelectorAll('.indicator').forEach(function(doc) {doc.parentNode.removeChild(doc)})
        }
        if (event.target.classList.contains('draggable') && this.tourJoueur==this.couleurJoueur && event.target.classList.contains(this.couleurJoueur)) {                   
            this.selectedPion = event.target;
            this.caseActive = this.selectedPion.parentNode;
            this.caseOptions = this.calculcaseOptions(this.getCurrentPosRow(this.caseActive), this.getCurrentPosCol(this.caseActive), this.getCurrentStatus(), this.getCurrentColor()).caseOpt;
            this.casePrises = this.calculcaseOptions(this.getCurrentPosRow(this.caseActive), this.getCurrentPosCol(this.caseActive), this.getCurrentStatus(), this.getCurrentColor()).caseTake;

            //Si la prise de pion adverse est possible, elle est OBLIGATOIRE !
            if(this.casePrises.size == 0){
                
                for (let selectableCase of this.caseOptions) {
                    let coloredIndicatorOfMoving = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    coloredIndicatorOfMoving.setAttributeNS(null, 'r', this.tailleCase/5+"%");
                    coloredIndicatorOfMoving.setAttributeNS(null, 'fill', '#89DEF3');
                    coloredIndicatorOfMoving.setAttributeNS(null, 'cx', (this.getPosX(selectableCase) + this.tailleCase/2).toString() + "%");
                    coloredIndicatorOfMoving.setAttributeNS(null, 'cy', (this.getPosY(selectableCase) + this.tailleCase/2).toString() + "%");
                    coloredIndicatorOfMoving.setAttribute('class', 'indicator');
                    selectableCase.appendChild(coloredIndicatorOfMoving);
                }
            } else {
                for (let [caseSaute, caseDestination] of this.casePrises) {
                    if(this.getCurrentStatus() == 'pion'){
                            let coloredIndicatorOfPrise = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                            coloredIndicatorOfPrise.setAttributeNS(null, 'r', this.tailleCase/5+"%");
                            coloredIndicatorOfPrise.setAttributeNS(null, 'fill', 'red');
                            coloredIndicatorOfPrise.setAttributeNS(null, 'cx', (this.getPosX(caseDestination) + this.tailleCase/2).toString() + "%");
                            coloredIndicatorOfPrise.setAttributeNS(null, 'cy', (this.getPosY(caseDestination) + this.tailleCase/2).toString() + "%");
                            coloredIndicatorOfPrise.setAttribute('class', 'indicatorPrise');
                            caseDestination.appendChild(coloredIndicatorOfPrise);
                    } else {
                        for(let cd of caseDestination){
                            let coloredIndicatorOfPrise = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                            coloredIndicatorOfPrise.setAttributeNS(null, 'r', this.tailleCase/5+"%");
                            coloredIndicatorOfPrise.setAttributeNS(null, 'fill', 'red');
                            coloredIndicatorOfPrise.setAttributeNS(null, 'cx', (this.getPosX(cd)  + this.tailleCase/2).toString() + "%");
                            coloredIndicatorOfPrise.setAttributeNS(null, 'cy', (this.getPosY(cd)  + this.tailleCase/2).toString() + "%");
                            coloredIndicatorOfPrise.setAttribute('class', 'indicatorPrise');
                            cd.appendChild(coloredIndicatorOfPrise);
                        }
                    }
                }       
            }
        }
    }

    releasePion(event) {

        //prise OBLIGATOIRE
        if(this.casePrises.size == 0 && this.tourJoueur == this.couleurJoueur){
            this.caseChoisie = this.moving(this.caseOptions, event);
            
        } else if (this.casePrises.size != 0 && this.tourJoueur == this.couleurJoueur){
            this.caseChoisie = this.prise(this.casePrises, event);
            if(document.querySelector('.white') == null){
                if(this.gameType == "onLine") {
                    let event = new CustomEvent("win", { detail: { couleurJoueur: "black"} });
                    let elm = document.getElementById("damier");
                    elm.dispatchEvent(event);
                } else {
                    let result = confirm("Partie Terminée : Les Noirs ont gagnés ! Voulez-vous rejouer ?");
                    if(result) {
                        new Game("local", "white");
                    }
                    else {
                        document.getElementById('cancelLocal').style.display = "none";
                        login.accueil();
                    }
                }
                console.log('win', "black");
            } else if (document.querySelector('.black') == null) {
                if(this.gameType == "onLine") {
                    let event = new CustomEvent("win", { detail: { couleurJoueur: "white"} });
                    let elm = document.getElementById("damier");
                    elm.dispatchEvent(event);
                }
                else {
                    let result = confirm("Partie Terminée : Les Blancs ont gagnés ! Voulez-vous rejouer ?");
                    if(result) {
                        new Game("local", "white");
                    }
                    else {
                        document.getElementById('cancelLocal').style.display = "none";
                        login.accueil();
                    }
                }
                console.log('win white');
            }
        }
        this.upgradePionToDame(this.getCurrentPosRow(this.caseChoisie), this.getCurrentColor(), this.getCurrentStatus(), this.tailleDamier);
        
    }

    //correcteur de la position de souris
    getMousePosition(event) {
        let CTM = damier.getScreenCTM();
        //Si sur mobile
        if(event != undefined && event.touches){
            event = event.touches[0];
        }
        //on transforme la position de la souris (en px, obtenue via CTM) en position en % sur notre damier (car la position d'une case est en %)
        if(event != undefined ) {
            return {
                x: ((event.clientX - CTM.e)*10 / CTM.a)/(parseInt(document.getElementById("damier").style.height)/this.tailleCase),
                y: ((event.clientY - CTM.f)*10 / CTM.d)/(parseInt(document.getElementById("damier").style.height)/this.tailleCase)
            };
        }
    }

    //fonction permettant de proposer des cases jouables (tableau de <g></g>) selon
    // la couleur du pion, son statut (pion ou dame), la position du pion courant cliqué
    calculcaseOptions(posRow, posCol, statusPion, colorPion) {
        if(statusPion == 'pion'){
            return this.comportementPion(posRow, posCol, colorPion);
        } else if (statusPion == 'dame'){
            return this.comportementDame(posRow, posCol, colorPion);
        } else {
            throw Error("Status spécifie incorrect");
        }
    }

    getPosX(selectedCase) {
        return parseInt(selectedCase.querySelector('rect').getAttribute('x'));
    }

    getPosY(selectedCase) {
        return parseInt(selectedCase.querySelector('rect').getAttribute('y'));
    }

    getCurrentPosRow(caseActive) {
        if(caseActive != undefined) {
            return parseInt(caseActive.getAttribute('id').split("/")[0]);
        }            
    }

    getCurrentPosCol(caseActive) {
        if(caseActive != undefined) {
            return parseInt(caseActive.getAttribute('id').split("/")[1]);
        }
    }

    getCurrentStatus() {
        if(this.selectedPion != undefined) {
            return this.selectedPion.classList[0];
        }
    }

    getCurrentColor() {
        if(this.selectedPion != undefined) {
            return this.selectedPion.classList[1];
        }
    }

    //retourne les cases mangeables pour le pion selectionné + cases sur lesquelles il peut aller
    comportementPion(posRow, posCol, colorPion) {
        let caseOpt = [];
        let caseTake = new Map();
        let adverseColor = colorPion == "white" ? "black" : "white";
        //jeu en local -> les blancs et les noirs ne joues pas dans le même sens
        if(this.gameType == "local") {
            if (colorPion == 'white') {
                let caseLeft = document.getElementById((posRow - 1) + '/' + (posCol - 1));
                let caseRight = document.getElementById((posRow - 1) + '/' + (posCol + 1));
                let caseBackRight = document.getElementById((posRow + 1) + '/' + (posCol + 1));
                let caseBackLeft = document.getElementById((posRow + 1) + '/' + (posCol - 1));
                if (caseLeft != null && caseLeft.classList.contains('free')) {
                    caseOpt.push(caseLeft);
                }
                if (caseRight != null && caseRight.classList.contains('free')) {
                    caseOpt.push(caseRight);
                }
                //Si les cases droites / gauches / arrDroite / arrGauche sont occupées par l'adversaire,
                //On vérifie que l'on peut manger ce pion
                if (caseLeft != null && caseLeft.classList.contains('black')) {
                    let casePriseAdvLeft = document.getElementById((posRow - 2) + '/' + (posCol - 2));
                    if (casePriseAdvLeft != null && casePriseAdvLeft.classList.contains('free')) {
                        caseTake.set(caseLeft, casePriseAdvLeft);
                    }
                }
                if (caseRight != null && caseRight.classList.contains('black')) {
                    let casePriseAdvRight = document.getElementById((posRow - 2) + '/' + (posCol + 2));
                    if (casePriseAdvRight != null && casePriseAdvRight.classList.contains('free')) {
                        caseTake.set(caseRight, casePriseAdvRight);
                    }
                }
                if (caseBackLeft != null && caseBackLeft.classList.contains('black')) {
                    let casePriseAdvBackLeft = document.getElementById((posRow + 2) + '/' + (posCol - 2));
                    if (casePriseAdvBackLeft != null && casePriseAdvBackLeft.classList.contains('free')) {
                        caseTake.set(caseBackLeft, casePriseAdvBackLeft);
                    }
                }
                if (caseBackRight != null && caseBackRight.classList.contains('black')) {
                    let casePriseAdvBackRight = document.getElementById((posRow + 2) + '/' + (posCol + 2));
                    if (casePriseAdvBackRight != null && casePriseAdvBackRight.classList.contains('free')) {
                        caseTake.set(caseBackRight, casePriseAdvBackRight);
                    }
                }
                return {
                    caseOpt,
                    caseTake
                }
            } else if(colorPion == 'black') {
                let caseLeft = document.getElementById((posRow + 1) + '/' + (posCol - 1));
                let caseRight = document.getElementById((posRow + 1) + '/' + (posCol + 1));
                let caseBackRight = document.getElementById((posRow - 1) + '/' + (posCol + 1));
                let caseBackLeft = document.getElementById((posRow - 1 ) + '/' + (posCol - 1));
                if (caseLeft != null && caseLeft.classList.contains('free')) {
                    caseOpt.push(caseLeft);
                }
                if (caseRight != null && caseRight.classList.contains('free')) {
                    caseOpt.push(caseRight);
                }
                //Si les cases droites / gauches / arrDroite / arrGauche sont occupées par l'adversaire,
                //On vérifie que l'on peut manger ce pion
                if (caseLeft != null && caseLeft.classList.contains('white')) {
                    let casePriseAdvLeft = document.getElementById((posRow + 2) + '/' + (posCol - 2));
                    if (casePriseAdvLeft != null && casePriseAdvLeft.classList.contains('free')) {
                        caseTake.set(caseLeft, casePriseAdvLeft);
                    }
                }
                if (caseRight != null && caseRight.classList.contains('white')) {
                    let casePriseAdvRight = document.getElementById((posRow + 2) + '/' + (posCol + 2));
                    if (casePriseAdvRight != null && casePriseAdvRight.classList.contains('free')) {
                        caseTake.set(caseRight, casePriseAdvRight);
                    }
                }
                if (caseBackLeft != null && caseBackLeft.classList.contains('white')) {
                    let casePriseAdvBackLeft = document.getElementById((posRow - 2) + '/' + (posCol - 2));
                    if (casePriseAdvBackLeft != null && casePriseAdvBackLeft.classList.contains('free')) {
                        caseTake.set(caseBackLeft, casePriseAdvBackLeft);
                    }
                }
                if (caseBackRight != null && caseBackRight.classList.contains('white')) {
                    let casePriseAdvBackRight = document.getElementById((posRow - 2) + '/' + (posCol + 2));
                    if (casePriseAdvBackRight != null && casePriseAdvBackRight.classList.contains('free')) {
                        caseTake.set(caseBackRight, casePriseAdvBackRight);
                    }
                }
                return {
                    caseOpt,
                    caseTake
                }
            } else {
                throw Error('La couleur du pion selectionné n\'existe pas');
            }
        //cas multijoueurs : les deux couleurs avancent dans le même sens
        } else {
            let caseLeft = document.getElementById((posRow - 1) + '/' + (posCol - 1));
            let caseRight = document.getElementById((posRow - 1) + '/' + (posCol + 1));
            let caseBackRight = document.getElementById((posRow + 1) + '/' + (posCol + 1));
            let caseBackLeft = document.getElementById((posRow + 1) + '/' + (posCol - 1));
            if (caseLeft != null && caseLeft.classList.contains('free')) {
                caseOpt.push(caseLeft);
            }
            if (caseRight != null && caseRight.classList.contains('free')) {
                caseOpt.push(caseRight);
            }
            //Si les cases droites / gauches / arrDroite / arrGauche sont occupées par l'adversaire,
            //On vérifie que l'on peut mange ce pion
            if (caseLeft != null && caseLeft.classList.contains(adverseColor)) {
                let casePriseAdvLeft = document.getElementById((posRow - 2) + '/' + (posCol - 2));
                if (casePriseAdvLeft != null && casePriseAdvLeft.classList.contains('free')) {
                    caseTake.set(caseLeft, casePriseAdvLeft);
                }
            }
            if (caseRight != null && caseRight.classList.contains(adverseColor)) {
                let casePriseAdvRight = document.getElementById((posRow - 2) + '/' + (posCol + 2));
                if (casePriseAdvRight != null && casePriseAdvRight.classList.contains('free')) {
                    caseTake.set(caseRight, casePriseAdvRight);
                }
            }
            if (caseBackLeft != null && caseBackLeft.classList.contains(adverseColor)) {
                let casePriseAdvBackLeft = document.getElementById((posRow + 2) + '/' + (posCol - 2));
                if (casePriseAdvBackLeft != null && casePriseAdvBackLeft.classList.contains('free')) {
                    caseTake.set(caseBackLeft, casePriseAdvBackLeft);
                }
            }
            if (caseBackRight != null && caseBackRight.classList.contains(adverseColor)) {
                let casePriseAdvBackRight = document.getElementById((posRow + 2) + '/' + (posCol + 2));
                if (casePriseAdvBackRight != null && casePriseAdvBackRight.classList.contains('free')) {
                    caseTake.set(caseBackRight, casePriseAdvBackRight);
                }
            }
            return {
                caseOpt,
                caseTake
            }
        }
            
    }

    //retourne cases mangeables pour la dame + cases où elle peut se déplacer
    comportementDame(posRow, posCol, colorPion){
        let caseOpt = [];
        let caseTake = new Map();
        let caseDestinationsPossibles = [];
        let adverseColor = colorPion == 'black' ? 'white' : 'black';

        //déplacemement possibles
        //diag back left
        let i = 1;
        while(document.getElementById((posRow+i)+'/'+(posCol-i)) != null){
            if (document.getElementById((posRow+i)+'/'+(posCol-i)).classList.contains('free')){
                caseOpt.push(document.getElementById((posRow+i)+'/'+(posCol-i)));
            } else if (document.getElementById((posRow+i)+'/'+(posCol-i)).classList.contains(colorPion)) {
                break;
            }  else if (document.getElementById((posRow+i)+'/'+(posCol-i)).classList.contains(adverseColor)){
                let caseAdverse = document.getElementById((posRow+i)+'/'+(posCol-i));
                i++;
                while(document.getElementById((posRow+i)+'/'+(posCol-i)) != null){
                    if (document.getElementById((posRow+i)+'/'+(posCol-i)).classList.contains('free')){
                        caseDestinationsPossibles.push(document.getElementById((posRow+i)+'/'+(posCol-i)));
                        caseTake.set(caseAdverse, caseDestinationsPossibles);
                    } else {
                        break;
                    }
                    i++;
                }
                break;
            }
            i++;
        }
        //diag back right
        caseDestinationsPossibles = [];
        i = 1;
        while(document.getElementById((posRow+i)+'/'+(posCol+i)) != null){
            if (document.getElementById((posRow+i)+'/'+(posCol+i)).classList.contains('free')){
                caseOpt.push(document.getElementById((posRow+i)+'/'+(posCol+i)));
            } else if (document.getElementById((posRow+i)+'/'+(posCol+i)).classList.contains(colorPion)) {
                break;
            }  else if (document.getElementById((posRow+i)+'/'+(posCol+i)).classList.contains(adverseColor)){
                let caseAdverse = document.getElementById((posRow+i)+'/'+(posCol+i));
                i++;
                while(document.getElementById((posRow+i)+'/'+(posCol+i)) != null){
                    if (document.getElementById((posRow+i)+'/'+(posCol+i)).classList.contains('free')){
                        caseDestinationsPossibles.push(document.getElementById((posRow+i)+'/'+(posCol+i)))
                        caseTake.set(caseAdverse, caseDestinationsPossibles);
                    } else {
                        break;
                    }
                    i++;
                }
                break;
            }
            i++;
        }
        //diag left
        caseDestinationsPossibles = [];
        i = 1;
        while(document.getElementById((posRow-i)+'/'+(posCol-i)) != null){
            if (document.getElementById((posRow-i)+'/'+(posCol-i)).classList.contains('free')){
                caseOpt.push(document.getElementById((posRow-i)+'/'+(posCol-i)));
            } else if (document.getElementById((posRow-i)+'/'+(posCol-i)).classList.contains(colorPion)) {
                break;
            }  else if (document.getElementById((posRow-i)+'/'+(posCol-i)).classList.contains(adverseColor)){
                let caseAdverse = document.getElementById((posRow-i)+'/'+(posCol-i));
                i++;
                while(document.getElementById((posRow-i)+'/'+(posCol-i)) != null){
                    if (document.getElementById((posRow-i)+'/'+(posCol-i)).classList.contains('free')){
                        caseDestinationsPossibles.push(document.getElementById((posRow-i)+'/'+(posCol-i)))
                        caseTake.set(caseAdverse, caseDestinationsPossibles);
                    } else {
                        break;
                    }
                    i++;
                }
                break;
            }
            i++;
        }
        //diag right
        caseDestinationsPossibles = [];
        i = 1;
        while(document.getElementById((posRow-i)+'/'+(posCol+i)) != null){
            if (document.getElementById((posRow-i)+'/'+(posCol+i)).classList.contains('free')){
                caseOpt.push(document.getElementById((posRow-i)+'/'+(posCol+i)));
            } else if (document.getElementById((posRow-i)+'/'+(posCol+i)).classList.contains(colorPion)) {
                break;
            }  else if (document.getElementById((posRow-i)+'/'+(posCol+i)).classList.contains(adverseColor)){
                let caseAdverse = document.getElementById((posRow-i)+'/'+(posCol+i));
                i++;
                while(document.getElementById((posRow-i)+'/'+(posCol+i)) != null){
                    if (document.getElementById((posRow-i)+'/'+(posCol+i)).classList.contains('free')){
                        caseDestinationsPossibles.push(document.getElementById((posRow-i)+'/'+(posCol+i)))
                        caseTake.set(caseAdverse, caseDestinationsPossibles);
                    } else {
                        break;
                    }
                    i++;
                }
                break;
            }
            i++;
        }
        return {
            caseOpt,
            caseTake
        }       
        
    }

    //fonction de vérification et de passage d'un pion à une dame
    upgradePionToDame(posRow, colorPion, statusPion, tailleDamier){
        let isUpgradable = false;
        if(statusPion == "pion"){
            if (this.gameType == "local") {
                if(colorPion == 'black'){
                    if(posRow+1 == tailleDamier){
                        this.selectedPion.setAttribute('class', 'dame black draggable');
                        this.selectedPion.setAttributeNS(null, 'stroke', 'red');
                        this.selectedPion.setAttributeNS(null, 'stroke-width', '4');
                        isUpgradable = true;
                    }
                } else {
                    if(posRow == 0){
                        this.selectedPion.setAttribute('class', 'dame white draggable');
                        this.selectedPion.setAttributeNS(null, 'stroke', 'red');
                        this.selectedPion.setAttributeNS(null, 'stroke-width', '4');
                        isUpgradable = true;
                    }
                }
            }
            else {
                if(posRow == 0){
                    this.selectedPion.setAttribute('class', 'dame '+this.couleurJoueur+' draggable');
                    this.selectedPion.setAttributeNS(null, 'stroke', 'red');
                    this.selectedPion.setAttributeNS(null, 'stroke-width', '4');
                    isUpgradable = true;
                }
            }
           
        } else {
            isUpgradable = false;
        }
        return isUpgradable;
    }


    moving(caseOptions, event){
        if(event != undefined) {
            let caseDestination = this.caseActive;
            let mouseX = this.getMousePosition(event).x;
            let mouseY = this.getMousePosition(event).y;
            //si la personne relache le clic sans rien faire on efface les indicateurs
            for (let selectableCase of caseOptions) {
                if(selectableCase.querySelector('.indicator')) {
                    selectableCase.removeChild(selectableCase.querySelector('.indicator'));
                }
                //si le release s'effectue au dessus d'une case autorisée
                if((this.getPosX(selectableCase)<=mouseX && this.getPosX(selectableCase)+this.tailleCase>=mouseX) && (this.getPosY(selectableCase)<=mouseY && this.getPosY(selectableCase)+this.tailleCase>=mouseY)){
                    if(selectableCase.classList[0] != "busy" && this.caseActive.classList[0] == "busy") {
                        let clone = this.selectedPion.cloneNode();
                        clone.setAttributeNS(null, 'cx', (this.getPosX(selectableCase) + this.tailleCase/2).toString() + "%");
                        clone.setAttributeNS(null, 'cy', (this.getPosY(selectableCase) + this.tailleCase/2).toString() + "%");
                        selectableCase.setAttribute('class', 'busy '+this.getCurrentColor());
                        selectableCase.appendChild(clone);
                        if(this.caseActive.contains(this.selectedPion)) {
                            this.caseActive.removeChild(this.selectedPion);
                            this.caseActive.setAttribute('class', 'free');
                        }
                        //la caseDestination devient la case selectionnée
                        caseDestination = selectableCase;
                        // le pion selectionné devient le clone de son dépacement
                        // nécessaire pour l'upgrade en dame
                        this.selectedPion = clone;
                        //on envoie le mouvement via evenement au serveur si le jeu est en ligne
                        if(this.gameType == "onLine" && this.tourJoueur == this.couleurJoueur) {
                            let event = new CustomEvent("move", { detail: { anciennePosition: this.caseActive.id, nouvellePosition: caseDestination.id } });
                            let elm = document.getElementById("damier");
                            elm.dispatchEvent(event);
                        }
                        
                        this.tourJoueur = (this.tourJoueur=="white" ? "black" : "white");
                        if(this.gameType != "onLine") {
                            this.couleurJoueur = (this.couleurJoueur=="white" ? "black" : "white");
                        }
                        document.getElementById("damier").style.border = "5px solid "+this.tourJoueur;
                    }
                    
                }
            }
            return caseDestination;
        }
    }

    prise(casePrises, event){
        let caseDesti = this.caseActive
        let mouseX = this.getMousePosition(event).x;
        let mouseY = this.getMousePosition(event).y;
        for (let [caseSaute, caseDestination] of casePrises){
            if(this.getCurrentStatus() == 'pion'){
                if(caseDestination.querySelector('.indicatorPrise')) {
                    caseDestination.removeChild(caseDestination.querySelector('.indicatorPrise'));
                }
                if((this.getPosX(caseDestination)<=mouseX && this.getPosX(caseDestination)+this.tailleCase>=mouseX) && (this.getPosY(caseDestination)<=mouseY && this.getPosY(caseDestination)+this.tailleCase>=mouseY)){
                    if(caseDestination.classList[0] != "busy" && this.caseActive.classList[0] == "busy") {
                        let clone = this.selectedPion.cloneNode();
                        clone.setAttributeNS(null, 'cx', (this.getPosX(caseDestination) + this.tailleCase/2).toString() + "%");
                        clone.setAttributeNS(null, 'cy', (this.getPosY(caseDestination) + this.tailleCase/2).toString() + "%");
                        caseDestination.setAttribute('class', 'busy '+this.getCurrentColor());
                        caseDestination.appendChild(clone);
                        this.caseActive.removeChild(this.selectedPion);
                        this.caseActive.setAttribute('class', 'free');
                        //on mange le pion (pion ou dame) sauté
                        caseSaute.removeChild(caseSaute.querySelector('.draggable'));
                        caseSaute.setAttribute('class', 'free');
                        //la caseDestination devient la case selectionnée
                        caseDesti = caseDestination;
                        // nécessaire pour l'upgrade en dame
                        this.selectedPion = clone;

                        if(this.gameType == "onLine" && this.tourJoueur == this.couleurJoueur) {
                            let event = new CustomEvent("prise", { detail: { anciennePosition: this.caseActive.id, prise: caseSaute.id, nouvellePosition: caseDesti.id } });
                            let elm = document.getElementById("damier");
                            elm.dispatchEvent(event);
                        }
                        
                        //calcul de si le pion selectionné doit encore prendre un pion adverse :
                        this.casePrises = this.calculcaseOptions(this.getCurrentPosRow(caseDesti), this.getCurrentPosCol(caseDesti), this.getCurrentStatus(), this.getCurrentColor()).caseTake;
                        //Si la prise de pion adverse est encore possible, elle est OBLIGATOIRE !
                        if(this.casePrises.size == 0){
                            this.tourJoueur = (this.tourJoueur=="white" ? "black" : "white");
                            if(this.gameType != "onLine" ) {
                                this.couleurJoueur = (this.couleurJoueur=="white" ? "black" : "white");
                            }
                            document.getElementById("damier").style.border = "5px solid "+this.tourJoueur;
                        }
                    }
                }
            } else {
                for(let cd of caseDestination){
                    cd.removeChild(cd.querySelector('.indicatorPrise'));
                    if((this.getPosX(cd)<=mouseX && this.getPosX(cd)+this.tailleCase>=mouseX) && (this.getPosY(cd)<=mouseY && this.getPosY(cd)+this.tailleCase>=mouseY)){
                        if(cd.classList[0] != "busy" && this.caseActive.classList[0] == "busy") {
                            let clone = this.selectedPion.cloneNode();
                            clone.setAttributeNS(null, 'cx', (this.getPosX(cd) + this.tailleCase/2).toString() + "%");
                            clone.setAttributeNS(null, 'cy', (this.getPosY(cd) + this.tailleCase/2).toString() + "%");
                            cd.setAttribute('class', 'busy '+this.getCurrentColor());
                            cd.appendChild(clone);
                            this.caseActive.removeChild(this.selectedPion);
                            this.caseActive.setAttribute('class', 'free');
                            caseSaute.removeChild(caseSaute.querySelector('.draggable'));
                            caseSaute.setAttribute('class', 'free');                            
                            //la caseDestination devient la case selectionnée
                            caseDesti = cd;
                            // nécessaire pour l'upgrade en dame
                            this.selectedPion = clone;

                            if(this.gameType == "onLine" && this.tourJoueur == this.couleurJoueur) {
                                let event = new CustomEvent("prise", { detail: { anciennePosition: this.caseActive.id, prise: caseSaute.id, nouvellePosition: caseDesti.id } });
                                let elm = document.getElementById("damier");
                                elm.dispatchEvent(event);
                            }
                            
                            this.casePrises = this.calculcaseOptions(this.getCurrentPosRow(caseDesti), this.getCurrentPosCol(caseDesti), this.getCurrentStatus(), this.getCurrentColor()).caseTake;
                            //Si la prise de pion adverse est encore possible, elle est OBLIGATOIRE !
                            if(this.casePrises.size == 0){
                                this.tourJoueur = (this.tourJoueur=="white" ? "black" : "white");
                                if(this.gameType != "onLine") {
                                    this.couleurJoueur = (this.couleurJoueur=="white" ? "black" : "white");
                                }
                                document.getElementById("damier").style.border = "5px solid "+this.tourJoueur;
                            }
                        }
                    }
                }
            }
        }
        return caseDesti;
    }
    //Affiche graphiquement le mouvement réalisé par le joueur adverse en ligne
    moveAdverse(detailMove) {
        let caseDepart = document.getElementById(detailMove.anciennePosition);
        let caseArrive = document.getElementById(detailMove.nouvellePosition);
        if (caseDepart.getElementsByTagName("circle")[0]) {
            let clone = caseDepart.getElementsByTagName("circle")[0].cloneNode();
            let colorPion = clone.getAttribute("class").split(' ')[1];
            clone.setAttributeNS(null, 'cx', (this.getPosX(caseArrive) + this.tailleCase/2).toString() + "%");
            clone.setAttributeNS(null, 'cy', (this.getPosY(caseArrive) + this.tailleCase/2).toString() + "%");
            caseArrive.setAttribute('class', 'busy '+colorPion);
            caseDepart.setAttribute('class', 'free');
            caseDepart.removeChild(caseDepart.getElementsByTagName("circle")[0]);
            let dame = this.upgradePionToDameAdverse(parseInt(caseArrive.getAttribute('id').split("/")[0]), colorPion, this.tailleDamier);
            if (dame == true) {
                clone.setAttribute('class', 'dame '+ colorPion + ' draggable');
                clone.setAttributeNS(null, 'stroke', 'red');
                clone.setAttributeNS(null, 'stroke-width', '4');
            }
            caseArrive.appendChild(clone);
        }
        this.tourJoueur = (this.tourJoueur=="white" ? "black" : "white");
        document.getElementById("damier").style.border = "5px solid "+this.tourJoueur;
        
    }
    //Affiche graphiquement la prise de notre pion réalisée par le joueur adverse en ligne
    priseAdverse(detailMove) {
        let caseDepart = document.getElementById(detailMove.anciennePosition);
        let caseSaute =  document.getElementById(detailMove.prise);
        let caseArrive = document.getElementById(detailMove.nouvellePosition);
        if (caseDepart.getElementsByTagName("circle")[0]) {
            let clone = caseDepart.getElementsByTagName("circle")[0].cloneNode();
            let colorPion = clone.getAttribute("class").split(' ')[1];
            clone.setAttributeNS(null, 'cx', (this.getPosX(caseArrive) + this.tailleCase/2).toString() + "%");
            clone.setAttributeNS(null, 'cy', (this.getPosY(caseArrive) + this.tailleCase/2).toString() + "%");
            caseArrive.setAttribute('class', 'busy '+colorPion);
            caseSaute.removeChild(caseSaute.getElementsByTagName("circle")[0]);
            caseSaute.setAttribute('class', 'free');
            caseDepart.setAttribute('class', 'free');
            caseDepart.removeChild(caseDepart.getElementsByTagName("circle")[0]);
            let dame = this.upgradePionToDameAdverse(parseInt(caseArrive.getAttribute('id').split("/")[0]),colorPion, this.tailleDamier);
            if (dame == true) {
                clone.setAttribute('class', 'dame '+ colorPion + ' draggable');
                clone.setAttributeNS(null, 'stroke', 'red');
                clone.setAttributeNS(null, 'stroke-width', '4');
            }
            caseArrive.appendChild(clone);
            let casePrises = this.calculcaseOptions(this.getCurrentPosRow(caseArrive), this.getCurrentPosCol(caseArrive), clone.classList[0], clone.classList[1]).caseTake;
            //Si la prise de pion adverse est possible, elle est OBLIGATOIRE, le joueur adverse doit donc encore jouer
            if(casePrises.size == 0){
                this.tourJoueur = (this.tourJoueur=="white" ? "black" : "white");
                document.getElementById("damier").style.border = "5px solid "+this.tourJoueur;
            }
        }
        if(document.querySelector('.white') == null){
            let event = new CustomEvent("win", { detail: { couleurJoueur: "black"} });
            let elm = document.getElementById("damier");
            elm.dispatchEvent(event);
            
        } else if (document.querySelector('.black') == null) {
            let event = new CustomEvent("win", { detail: { couleurJoueur: "white"} });
            let elm = document.getElementById("damier");
            elm.dispatchEvent(event);
        }
    }

    //test si le pion adverse est devenu une dame :
    upgradePionToDameAdverse(posRow, colorPion, tailleDamier){
        let dame = false;
        if(colorPion == this.couleurJoueur){
            if(posRow == 0){
                dame = true;
            }
        } else {
            if(posRow+1 == tailleDamier){
                dame = true;
            }
        }
         return dame;
     }
}