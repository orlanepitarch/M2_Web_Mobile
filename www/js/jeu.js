
//class Game {
    /*constructor(event){
        this.event = event;
        this.displayDamier();
        makeDraggable();
    }*/

    let selectedPion, caseActive, caseChoisie;
    let caseOptions = [];

    //let tailleDamier = prompt("Veuillez choisir la taille de votre damier (valeur minimale 6) :")
    new Damier(10);

    function makeDraggable(event){
        let damier = event.target;
        damier.addEventListener('mousedown', clickedPion);
        function clickedPion(event){
            if (event.target.classList.contains('draggable')) {
                selectedPion = event.target;
                caseActive = selectedPion.parentNode;
                console.log(caseActive);
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


    //hotfix pour tout screen, correcteur de la position de souris
    //utile en cas de view box
    function getMousePosition(event) {
        let CTM = mySvg.getScreenCTM();
        //Si sur mobile
        if (event.touches) { event = event.touches[0]; }
        return {
            x: (event.clientX - CTM.e) / CTM.a,
            y: (event.clientY - CTM.f) / CTM.d
        };
    }
*/