
class Game {
    /*constructor(event){
        this.event = event;
        this.displayDamier();
        makeDraggable();
    }*/
    constructor(gameType, couleurJoueur) {
        this.selectedPion, this.caseActive, this.caseChoisie
        this.caseOptions = [];
        this.casePrises = new Map();
        this.tailleDamier = 10;
        this.couleurJoueur = couleurJoueur;
        console.log("Joueur "+this.couleurJoueur);
        this.tourJoueur = "white";
        console.log("Joueur "+this.tourJoueur);
        document.getElementById("damier").style.border = "5px solid white";
        this.gameType = gameType;
    
    
        //let this.tailleDamier = prompt("Veuillez choisir la taille de votre damier (valeur minimale 6) :")
        new Damier(this.tailleDamier);
        this.makeDraggable(document.getElementById("damier"));
    }
    
    // let test = document.getElementById("3/4").querySelector('.pion');
    // test.setAttribute('class', 'dame black draggable');
    // test.setAttributeNS(null, 'stroke', 'red');
    // test.setAttributeNS(null, 'stroke-width', '4');

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
        if (event.target.classList.contains('draggable') && this.tourJoueur==this.couleurJoueur && event.target.classList.contains(this.couleurJoueur)) {                   
            this.selectedPion = event.target;
            this.caseActive = this.selectedPion.parentNode;
            this.caseOptions = this.calculcaseOptions(this.getCurrentPosRow(this.caseActive), this.getCurrentPosCol(this.caseActive), this.getCurrentStatus(), this.getCurrentColor()).caseOpt;
            this.casePrises = this.calculcaseOptions(this.getCurrentPosRow(this.caseActive), this.getCurrentPosCol(this.caseActive), this.getCurrentStatus(), this.getCurrentColor()).caseTake;

            //Si la prise de pion adverse est possible, elle est OBLIGATOIRE !
            if(this.casePrises.size == 0){
                for (let selectableCase of this.caseOptions) {
                    let coloredIndicatorOfMoving = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    coloredIndicatorOfMoving.setAttributeNS(null, 'r', '9');
                    coloredIndicatorOfMoving.setAttributeNS(null, 'fill', '#89DEF3');
                    coloredIndicatorOfMoving.setAttributeNS(null, 'cx', (this.getPosX(selectableCase) + 25).toString());
                    coloredIndicatorOfMoving.setAttributeNS(null, 'cy', (this.getPosY(selectableCase) + 25).toString());
                    coloredIndicatorOfMoving.setAttribute('class', 'indicator');
                    selectableCase.appendChild(coloredIndicatorOfMoving);
                }
            } else {
                for (let [caseSaute, caseDestination] of this.casePrises) {
                    if(this.getCurrentStatus() == 'pion'){
                            let coloredIndicatorOfPrise = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                            coloredIndicatorOfPrise.setAttributeNS(null, 'r', '11');
                            coloredIndicatorOfPrise.setAttributeNS(null, 'fill', 'red');
                            coloredIndicatorOfPrise.setAttributeNS(null, 'cx', (this.getPosX(caseDestination) + 25).toString());
                            coloredIndicatorOfPrise.setAttributeNS(null, 'cy', (this.getPosY(caseDestination) + 25).toString());
                            coloredIndicatorOfPrise.setAttribute('class', 'indicatorPrise');
                            caseDestination.appendChild(coloredIndicatorOfPrise);
                    } else {
                        for(let cd of caseDestination){
                            let coloredIndicatorOfPrise = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                            coloredIndicatorOfPrise.setAttributeNS(null, 'r', '11');
                            coloredIndicatorOfPrise.setAttributeNS(null, 'fill', 'red');
                            coloredIndicatorOfPrise.setAttributeNS(null, 'cx', (this.getPosX(cd) + 25).toString());
                            coloredIndicatorOfPrise.setAttributeNS(null, 'cy', (this.getPosY(cd) + 25).toString());
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

    //hotfix pour tout screen, correcteur de la position de souris
    //utile en cas de view box
    getMousePosition(event) {
        let CTM = damier.getScreenCTM();
        //Si sur mobile
        if(event != undefined && event.touches){
            event = event.touches[0];
        }
        if(event != undefined ) {
            return {
                x: (event.clientX - CTM.e) / CTM.a,
                y: (event.clientY - CTM.f) / CTM.d
            };
        }
    }

    //fonction permettant de proposer des cases jouables (tableau de <g></g>) selon
    // la couleur du pion, son sta                console.log("moncul");tut (pion ou dame), la position du pion courant cliqué
    // return this.caseOptions[]
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

    comportementPion(posRow, posCol, colorPion) {
        let caseOpt = [];
        let caseTake = new Map();
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
                //Si les cases droites / gauches / arrDroite / arrGauche sont occupés par l'adversaire,
                //On vérifie que l'on peut damer le pion
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
                //Si les cases droites / gauches / arrDroite / arrGauche sont occupés par l'adversaire,
                //On vérifie que l'on peut damer le pion
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
    }

    comportementDame(posRow, posCol, colorPion){
        let caseOpt = [];
        let caseTake = new Map();
        let caseDestinationsPossibles = [];
        let adverseColor = colorPion == 'black' ? 'white' : 'black';

        //déplacemement possibles
        //diag left
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
        //déplacemement possibles
        //diag right
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

        //diag back left
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
            //si la personne relache le clic sans rien faire on efface au moins les indicateurs
            for (let selectableCase of caseOptions) {
                if(selectableCase.querySelector('.indicator')) {
                    selectableCase.removeChild(selectableCase.querySelector('.indicator'));
                }
                //si le release s'effectue au dessus d'une case authorisée
                if((this.getPosX(selectableCase)<=mouseX && this.getPosX(selectableCase)+49>=mouseX) && (this.getPosY(selectableCase)<=mouseY && this.getPosY(selectableCase)+49>=mouseY)){
                    console.log("case active ", this.caseActive);
                    console.log("selectableCase", selectableCase);
                    if(selectableCase.classList[0] != "busy" && this.caseActive.classList[0] == "busy") {
                        let clone = this.selectedPion.cloneNode();
                        clone.setAttributeNS(null, 'cx', (this.getPosX(selectableCase) + 25).toString());
                        clone.setAttributeNS(null, 'cy', (this.getPosY(selectableCase) + 25).toString());
                        selectableCase.setAttribute('class', 'busy '+this.getCurrentColor());
                        selectableCase.appendChild(clone);
                        console.log("move",this.selectedPion);
                        if(this.caseActive.contains(this.selectedPion)) {
                            this.caseActive.removeChild(this.selectedPion);
                            this.caseActive.setAttribute('class', 'free');
                        }
                        //la caseFestination devient la case selectionné (après vérification)
                        caseDestination = selectableCase;
                        // le pion selectionne devient le clone de son dépacement
                        // nécessaire pour l'upgrade en dame
                        this.selectedPion = clone;
                        if(this.gameType == "onLine" && this.tourJoueur == this.couleurJoueur) {
                            let event = new CustomEvent("move", { detail: { anciennePosition: this.caseActive.id, nouvellePosition: caseDestination.id } });
                            let elm = document.getElementById("damier");
                            elm.dispatchEvent(event);
    
                            console.log('move', this.tourJoueur);
                        }
                        
                        this.tourJoueur = (this.tourJoueur=="white" ? "black" : "white");
                        if(this.gameType != "onLine") {
                            this.couleurJoueur = (this.couleurJoueur=="white" ? "black" : "white");
                        }
                        document.getElementById("damier").style.border = "5px solid "+this.tourJoueur;
                        console.log(this.tourJoueur)
                    }
                    
                }
            }
            return caseDestination;
        }
        //Si la case Destination n'est pas authoriser alors elle reste par défaut la this.caseActive
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
            
                if((this.getPosX(caseDestination)<=mouseX && this.getPosX(caseDestination)+49>=mouseX) && (this.getPosY(caseDestination)<=mouseY && this.getPosY(caseDestination)+49>=mouseY)){
                    if(caseDestination.classList[0] != "busy" && this.caseActive.classList[0] == "busy") {
                        let clone = this.selectedPion.cloneNode();
                        clone.setAttributeNS(null, 'cx', (this.getPosX(caseDestination) + 25).toString());
                        clone.setAttributeNS(null, 'cy', (this.getPosY(caseDestination) + 25).toString());
                        caseDestination.setAttribute('class', 'busy '+this.getCurrentColor());
                        caseDestination.appendChild(clone);
                        
                        this.caseActive.removeChild(this.selectedPion);
                        this.caseActive.setAttribute('class', 'free');
                        //on mange le pion (pion ou dame) saute
                        console.log("prise1",caseSaute.querySelector('.draggable'));
                        caseSaute.removeChild(caseSaute.querySelector('.draggable'));
                        caseSaute.setAttribute('class', 'free');
                        //la caseFestination devient la case selectionné (après vérification)
                        caseDesti = caseDestination;
                        // nécessaire pour l'upgrade en dame
                        
                        this.selectedPion = clone;

                        if(this.gameType == "onLine" && this.tourJoueur == this.couleurJoueur) {
                            let event = new CustomEvent("prise", { detail: { anciennePosition: this.caseActive.id, prise: caseSaute.id, nouvellePosition: caseDesti.id } });
                            let elm = document.getElementById("damier");
                            elm.dispatchEvent(event);
                        }
                        
                        
                        this.casePrises = this.calculcaseOptions(this.getCurrentPosRow(caseDesti), this.getCurrentPosCol(caseDesti), this.getCurrentStatus(), this.getCurrentColor()).caseTake;
                        //Si la prise de pion adverse est possible, elle est OBLIGATOIRE !
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
                    if((this.getPosX(cd)<=mouseX && this.getPosX(cd)+49>=mouseX) && (this.getPosY(cd)<=mouseY && this.getPosY(cd)+49>=mouseY)){
                        if(cd.classList[0] != "busy" && this.caseActive.classList[0] == "busy") {
                            let clone = this.selectedPion.cloneNode();
                            clone.setAttributeNS(null, 'cx', (this.getPosX(cd) + 25).toString());
                            clone.setAttributeNS(null, 'cy', (this.getPosY(cd) + 25).toString());
                            cd.setAttribute('class', 'busy '+this.getCurrentColor());
                            cd.appendChild(clone);
                            console.log("prise2", this.selectedPion);
                            this.caseActive.removeChild(this.selectedPion);
                            this.caseActive.setAttribute('class', 'free');
                            //on mange le pion saute
                            console.log("prise2", caseSaute.querySelector('.draggable'));
                            caseSaute.removeChild(caseSaute.querySelector('.draggable'));
                            caseSaute.setAttribute('class', 'free');
                            
                            //la caseFestination devient la case selectionné (après vérification)
                            caseDesti = cd;
                            // nécessaire pour l'upgrade en dame
                            this.selectedPion = clone;

                            if(this.gameType == "onLine" && this.tourJoueur == this.couleurJoueur) {
                                let event = new CustomEvent("prise", { detail: { anciennePosition: this.caseActive.id, prise: caseSaute.id, nouvellePosition: caseDesti.id } });
                                let elm = document.getElementById("damier");
                                elm.dispatchEvent(event);
                            }
                            
                            
                            this.casePrises = this.calculcaseOptions(this.getCurrentPosRow(caseDesti), this.getCurrentPosCol(caseDesti), this.getCurrentStatus(), this.getCurrentColor()).caseTake;
                            //Si la prise de pion adverse est possible, elle est OBLIGATOIRE !
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

    moveAdverse(detailMove) {
        let caseDepart = document.getElementById(detailMove.anciennePosition);
        let caseArrive = document.getElementById(detailMove.nouvellePosition);
        if (caseDepart.getElementsByTagName("circle")[0]) {
            let clone = caseDepart.getElementsByTagName("circle")[0].cloneNode();
            let colorPion = clone.getAttribute("class").split(' ')[1];
            clone.setAttributeNS(null, 'cx', (this.getPosX(caseArrive) + 25).toString());
            clone.setAttributeNS(null, 'cy', (this.getPosY(caseArrive) + 25).toString());
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
        console.log("moveAdverse");
        this.tourJoueur = (this.tourJoueur=="white" ? "black" : "white");
        document.getElementById("damier").style.border = "5px solid "+this.tourJoueur;
        
    }

    priseAdverse(detailMove) {
        console.log("prise", detailMove)
        let caseDepart = document.getElementById(detailMove.anciennePosition);
        let caseSaute =  document.getElementById(detailMove.prise);
        let caseArrive = document.getElementById(detailMove.nouvellePosition);
        if (caseDepart.getElementsByTagName("circle")[0]) {
            let clone = caseDepart.getElementsByTagName("circle")[0].cloneNode();
            let colorPion = clone.getAttribute("class").split(' ')[1];
            clone.setAttributeNS(null, 'cx', (this.getPosX(caseArrive) + 25).toString());
            clone.setAttributeNS(null, 'cy', (this.getPosY(caseArrive) + 25).toString());
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
            //Si la prise de pion adverse est possible, elle est OBLIGATOIRE !
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

    upgradePionToDameAdverse(posRow, colorPion, tailleDamier){
        let dame = false;
        if(colorPion == 'black'){
            if(posRow+1 == tailleDamier){
                dame = true;
            }
        } else {
            if(posRow == 0){
                dame = true;
            }
        }
         return dame;
     }
}
/*
    makeDraggable(event){
    var mySvg = event.target;
    //ajout des listeners à l'élément du DOM clické
    mySvg.addEventListener('mousedown', startDrag);
    mySvg.addEventListener('mousemove', drag);
    mySvg.addEventListener('mouseup', endDrag);
    mySvg.addEventListener('mouseleave', endDrag);

    //reponsiv mobile
    mySvg.addEventListener('touchstart', startDrag);
    mySvg.addEventListener('touchmove', drag);
    mySvg.addEventListener('touchend', endDrag);
    mySvg.addEventListener('touchleave', endDrag);
    mySvg.addEventListener('touchcancel', endDrag);



    /*
    //on propage l'event lors du clic le startDrag et declenché sur l'élement du DOM
    //V2 startDrag hotfix ==> calcul de l'offset au moment du clic
    //coin supérieur gauche
    function startDrag(event){
            //l'élément est-il de classe draggable dans le HTML ?
            if(event.target.classList.contains('draggable')) {
                    selectedElement =event.target;
                    offset = getMousePosition(event);
                    offset.x -= parseFloat(selectedElement.getAttributeNS(null, "x"));
                    offset.y -= parseFloat(selectedElement.getAttributeNS(null, "y"));

            }
    }*/

    //V3 startDrag prise en compte des svg ne possédant pas de coordonnées x, y
    // prise en compte des transform effectué sur ces svg...
    //HARD*/
    /*
    startDrag(event) {
        if (event.target.classList.contains('draggable')) {

            selectedElement = event.target;
            offset = getMousePosition(event);

            // Prendre en compte tout les transforme de l'élément courant
            var transforms = selectedElement.transform.baseVal;

            // S'assurer que la première transformation et un transform
            if (transforms.length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {

                // Créer un transform qui translate par (0, 0)
                var translate = mySvg.createSVGTransform();
                translate.setTranslate(0, 0);

                // mettre la translation en debut de transform List
                selectedElement.transform.baseVal.insertItemBefore(translate, 0);
            }

            // Enlever le montant de la translation initiale au offset
            transform = transforms.getItem(0);
            offset.x -= transform.matrix.e;
            offset.y -= transform.matrix.f;
        }
    }

    //lorsqu'on à cliqué sur l'élément on commence à déplacer ca position de 0.1 en .1 en suivant
    //la souris
    drag(event) {

        if(selectedElement) {
            console.log("ici");
            event.preventDefault();
            var coordonate = getMousePosition(event);
            transform.setTranslate(coordonate.x - offset.x, coordonate.y - offset.y);
        }
    }

    endDrag(event) {
        selectedElement = null;
    }


*/