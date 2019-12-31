
//class Game {
    /*constructor(event){
        this.event = event;
        this.displayDamier();
        makeDraggable();
    }*/

    let selectedPion, caseActive
    let caseOptions = [];
    let casePrises = new Map();

    //let tailleDamier = prompt("Veuillez choisir la taille de votre damier (valeur minimale 6) :")
    new Damier(10);

    function makeDraggable(event) {
        let damier = event.target;
        damier.addEventListener('mousedown', clickedPion);
        damier.addEventListener('mouseup', releasePion);

        function clickedPion(event) {
            if (event.target.classList.contains('draggable')) {
                selectedPion = event.target;
                caseActive = selectedPion.parentNode;
                caseOptions = calculCaseOptions(getCurrentPosRow(caseActive), getCurrentPosCol(caseActive), getCurrentStatus(), getCurrentColor()).caseOpt;
                casePrises = calculCaseOptions(getCurrentPosRow(caseActive), getCurrentPosCol(caseActive), getCurrentStatus(), getCurrentColor()).caseTake;
                //Si la prise de pion adverse est possible, elle est OBLIGATOIRE !
                if(casePrises.size == 0){
                    for (let selectableCase of caseOptions) {
                        let coloredIndicatorOfMoving = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        coloredIndicatorOfMoving.setAttributeNS(null, 'r', '9');
                        coloredIndicatorOfMoving.setAttributeNS(null, 'fill', '#89DEF3');
                        coloredIndicatorOfMoving.setAttributeNS(null, 'cx', (getPosX(selectableCase) + 25).toString());
                        coloredIndicatorOfMoving.setAttributeNS(null, 'cy', (getPosY(selectableCase) + 25).toString());
                        coloredIndicatorOfMoving.setAttribute('class', 'indicator');
                        selectableCase.appendChild(coloredIndicatorOfMoving);
                    }
                } else {
                    for (let [caseSaute, caseDestination] of casePrises) {
                        let coloredIndicatorOfPrise = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        coloredIndicatorOfPrise.setAttributeNS(null, 'r', '11');
                        coloredIndicatorOfPrise.setAttributeNS(null, 'fill', 'red');
                        coloredIndicatorOfPrise.setAttributeNS(null, 'cx', (getPosX(caseDestination) + 25).toString());
                        coloredIndicatorOfPrise.setAttributeNS(null, 'cy', (getPosY(caseDestination) + 25).toString());
                        coloredIndicatorOfPrise.setAttribute('class', 'indicatorPrise');
                        caseDestination.appendChild(coloredIndicatorOfPrise);
                    }
                }

            }
        }

        function releasePion(event) {
            //prise OBLIGATOIRE
            if(casePrises.size == 0){
                moving(caseOptions, event);
            } else {
                prise(casePrises, event);
            }
        }

        //hotfix pour tout screen, correcteur de la position de souris
        //utile en cas de view box
        function getMousePosition(event) {
            let CTM = damier.getScreenCTM();
            //Si sur mobile
            if (event.touches) {
                event = event.touches[0];
            }
            return {
                x: (event.clientX - CTM.e) / CTM.a,
                y: (event.clientY - CTM.f) / CTM.d
            };
        }

        //fonction permettant de proposer des cases jouables (tableau de <g></g>) selon
        // la couleur du pion, son statut (pion ou dame), la position du pion courant cliqué
        // return caseOptions[]
        function calculCaseOptions(posRow, posCol, statusPion, colorPion) {
            let caseOpt = [];
            let caseTake = new Map();
            if (statusPion == 'pion') {
                if (colorPion == 'black') {
                    let caseLeft = document.getElementById((posRow + 1) + '/' + (posCol - 1));
                    let caseRight = document.getElementById((posRow + 1) + '/' + (posCol + 1));
                    if (caseLeft != null && caseLeft.classList.contains('free')) {
                        caseOpt.push(caseLeft);
                    }
                    if (caseRight != null && caseRight.classList.contains('free') && caseRight != null) {
                        caseOpt.push(caseRight);
                    }
                    //Si les cases droites / gauches sont occupés par l'adversaire,
                    //On vérifie que l'on peut damer le pion
                    // si la prise est possible on stock la case adversere en clé, la case destination en valeure
                    if (caseLeft != null && caseLeft.classList.contains('white')){
                        let casePriseAdvLeft = document.getElementById((posRow+2) + '/' + (posCol-2));
                        if(casePriseAdvLeft != null && casePriseAdvLeft.classList.contains('free')){
                            caseTake.set(caseLeft, casePriseAdvLeft);
                        }
                    }
                    if (caseRight!= null && caseRight.classList.contains('white')){
                        let casePriseAdvRight = document.getElementById((posRow+2) + '/' + (posCol+2));
                        if(casePriseAdvRight != null && casePriseAdvRight.classList.contains('free')){
                            caseTake.set(caseRight, casePriseAdvRight);
                        }
                    }
                    return {
                        caseOpt,
                        caseTake
                    }
                } else if (colorPion == 'white') {
                    let caseLeft = document.getElementById((posRow - 1) + '/' + (posCol - 1));
                    let caseRight = document.getElementById((posRow - 1) + '/' + (posCol + 1));
                    if (caseLeft != null && caseLeft.classList.contains('free')) {
                        caseOpt.push(caseLeft);
                    }
                    if (caseRight != null && caseRight.classList.contains('free')) {
                        caseOpt.push(caseRight);
                    }
                    //Si les cases droites / gauches sont occupés par l'adversaire,
                    //On vérifie que l'on peut damer le pion
                    if (caseLeft != null && caseLeft.classList.contains('black')){
                        let casePriseAdvLeft = document.getElementById((posRow-2) + '/' + (posCol-2));
                        if(casePriseAdvLeft != null && casePriseAdvLeft.classList.contains('free')){
                            caseTake.set(caseLeft, casePriseAdvLeft);
                        }
                    }
                    if (caseRight != null && caseRight.classList.contains('black')){
                        let casePriseAdvRight = document.getElementById((posRow-2) + '/' + (posCol+2));
                        if(casePriseAdvRight != null && casePriseAdvRight.classList.contains('free')){
                            caseTake.set(caseRight, casePriseAdvRight);
                        }
                    }
                    return {
                        caseOpt,
                        caseTake
                    }
                } else {
                    throw Error('Couleur de pion selectionné impossible ! ');
                }

            }/* else if (statusPion == 'dame'){
            return caseOpt;
        } else {
            throw Error("Status spécifie incorrect");
        }

        if(.classList.contains('free')){

        }*/
        }

        function getPosX(selectedCase) {
            return parseInt(selectedCase.querySelector('rect').getAttribute('x'));
        }

        function getPosY(selectedCase) {
            return parseInt(selectedCase.querySelector('rect').getAttribute('y'));
        }

        function getCurrentPosRow(caseActive) {
            return parseInt(caseActive.getAttribute('id').split("/")[0]);
        }

        function getCurrentPosCol(caseActive) {
            return parseInt(caseActive.getAttribute('id').split("/")[1]);
        }

        function getCurrentStatus() {
            return selectedPion.classList[0];
        }

        function getCurrentColor() {
            return selectedPion.classList[1];
        }

        function moving(caseOptions, event){
            let mouseX = getMousePosition(event).x;
            let mouseY = getMousePosition(event).y;
            for (let selectableCase of caseOptions) {
                selectableCase.removeChild(selectableCase.querySelector('.indicator'));
                //si le release s'effectue au dessus d'une case authorisée
                if((getPosX(selectableCase)<=mouseX && getPosX(selectableCase)+49>=mouseX) && (getPosY(selectableCase)<=mouseY && getPosY(selectableCase)+49>=mouseY)){
                    let clone = selectedPion.cloneNode();
                    clone.setAttributeNS(null, 'cx', (getPosX(selectableCase) + 25).toString());
                    clone.setAttributeNS(null, 'cy', (getPosY(selectableCase) + 25).toString());
                    selectableCase.setAttribute('class', 'busy '+getCurrentColor());
                    selectableCase.appendChild(clone);
                    caseActive.removeChild(selectedPion);
                    caseActive.setAttribute('class', 'free');
                }
            }
        }

        function prise(casePrises, event){
            let mouseX = getMousePosition(event).x;
            let mouseY = getMousePosition(event).y;
            for (let [caseSaute, caseDestination] of casePrises){
                caseDestination.removeChild(caseDestination.querySelector('.indicatorPrise'));
                if((getPosX(caseDestination)<=mouseX && getPosX(caseDestination)+49>=mouseX) && (getPosY(caseDestination)<=mouseY && getPosY(caseDestination)+49>=mouseY)){
                    let clone = selectedPion.cloneNode();
                    clone.setAttributeNS(null, 'cx', (getPosX(caseDestination) + 25).toString());
                    clone.setAttributeNS(null, 'cy', (getPosY(caseDestination) + 25).toString());
                    caseDestination.setAttribute('class', 'busy '+getCurrentColor());
                    caseDestination.appendChild(clone);
                    caseActive.removeChild(selectedPion);
                    caseActive.setAttribute('class', 'free');
                    //on mange le pion
                    console.log(caseSaute);
                    caseSaute.removeChild(caseSaute.querySelector('.pion'));
                    caseSaute.setAttribute('class', 'free');
                }
            }
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