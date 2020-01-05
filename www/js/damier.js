class Damier{

    constructor(taille, couleurJoueur) {
        this.taille = taille;
        /*let damier = new Array(taille);

        for (let i = 0 ; i < taille ; i++) {
            let colonne = new Array(taille);
            damier[i] = colonne; // A chaque ligne, on ajoute les colonnes

            for (let j = 0; j < taille; j++) {
                // Dans chaque case on test de savoir si on est sur un numéro de case pair ou impair
                // Pour cela, on additionne de sa position dans les lignes et dans les colonnes.

                damier[i][j] = ( ((i+j)%2)== 0  ? 1 : -1);
            }
        }
    */
   
        this.tailleCase = (100/parseInt(this.taille));
        this.couleurBas = couleurJoueur;
        this.removeOldDamier();
        this.drawDamierSvg();
        this.drawPionSvg();
    }

    removeOldDamier() {
        let node= document.getElementById("damier");
        if(node.childElementCount > 0) {
            node.querySelectorAll('*').forEach(n => n.remove());
        }
    }
    drawDamierSvg(){
        let svg = document.querySelector('#damier');
        let colorVerifier = "white"; //variable temporaire permettant de permuter la couleur d'une case sur 2
        //contruction damier dynamique
        for (let i = 0 ; i < this.taille ; i++) {
            for (let j = 0; j < this.taille; j++) {
                let newx = this.tailleCase * i;
                let newy = this.tailleCase * j;
                let caseConteneur = document.createElementNS("http://www.w3.org/2000/svg", "g");
                caseConteneur.setAttributeNS(null, 'id', j.toString()+'/'+i.toString());
                svg.appendChild(caseConteneur);
                let caseSvg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                caseSvg.setAttributeNS(null, 'width', this.tailleCase+"%");
                caseSvg.setAttributeNS(null, 'height', this.tailleCase+"%");
                //datermine la couleur d'une case selon
                //si la taille du damier et pair ou impair
                if(this.taille%2 == 1){
                    if(colorVerifier == 'black'){
                        colorVerifier = 'white';
                        caseSvg.setAttributeNS(null, 'fill', '#a2762a');
                    } else {
                        colorVerifier = 'black';
                        caseSvg.setAttributeNS(null, 'fill', '#e5ca9a');
                    }
                } else {
                     if(colorVerifier == 'black'){
                         if(j == this.taille-1){
                             colorVerifier = 'black';
                         } else {
                             colorVerifier = 'white';
                         }
                        caseSvg.setAttributeNS(null, 'fill', '#a2762a');
                    } else {
                         if(j == this.taille-1){
                             colorVerifier = 'white';
                         } else {
                             colorVerifier = 'black';
                         }
                        caseSvg.setAttributeNS(null, 'fill', '#e5ca9a');
                    }
                }

                caseSvg.setAttributeNS(null, 'stroke-width', '2');
                caseSvg.setAttributeNS(null, 'stroke', 'black');
                caseSvg.setAttributeNS(null, "x", newx.toString()+"%");
                caseSvg.setAttributeNS(null, "y", newy.toString()+"%");
                //aucun pion sur le conteneur à sa créations
                caseConteneur.setAttribute('class', 'free');
                caseConteneur.appendChild(caseSvg);
            }
        }
        console.log("draw damier");
    }

    drawPionSvg(){
        let rayon = (this.tailleCase/3);
        for(let j = 0; j < this.taille; j++){
            for(let i = 0; i < this.taille; i++){
                //4 premières ligne et 4 dernières lignes remplises
                if(j==0 || j==1 || j==2 || j==3 || j==this.taille-4 || j==this.taille-3 || j==this.taille-2 || j==this.taille-1){
                    //on calcule les coordonnées
                    let newcx = this.tailleCase * i + (this.tailleCase/2);
                    let newcy = this.tailleCase * j + (this.tailleCase/2);
                    //Si le parent n'est pas une case de couleur foncé, il est inutile de créer un pion
                    let parental = document.getElementById(j.toString()+'/'+i.toString());
                    let caseCourante = parental.querySelector('rect');
                    if(caseCourante.getAttribute("fill") == '#a2762a'){
                        let pionSvg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        pionSvg.setAttributeNS(null, 'r', rayon.toString()+"%");
                        pionSvg.setAttributeNS(null, 'cx', newcx.toString()+"%");
                        pionSvg.setAttributeNS(null, 'cy', newcy.toString()+"%");
                        pionSvg.setAttributeNS(null, 'stroke-width', '2');
                        pionSvg.setAttributeNS(null, 'stroke', 'black');
                        if(j==0 || j==1 || j==2 || j==3){
                            if(this.couleurBas == "white") {
                                //on indique la nature du pion (pion) et son camp (black or white) ainsi que le fait
                                // que ce pion soit déplaçable (draggable)
                                // on indique que la case (<g></g>) parente du pion possèdera un attribut busy si la case est occupée
                                // ainsi que la couleur du pion qui l'occupe
                                // cela permettra une meilleure maniabilité des cases
                                // !!! L'attribut busy (black||white) doit être supprimé lorsque la case n'est plus occupé
                                pionSvg.setAttribute('class', 'pion black draggable');
                                pionSvg.setAttributeNS(null, 'fill', '#672D2E');
                                parental.setAttribute('class', 'busy black');
                            }else {
                                pionSvg.setAttribute('class', 'pion white draggable');
                                parental.setAttribute('class', 'busy white');
                                pionSvg.setAttributeNS(null, 'fill', '#FDDDA7');
                            }
                        } else {
                            if(this.couleurBas == "white") {                                
                                pionSvg.setAttribute('class', 'pion white draggable');
                                parental.setAttribute('class', 'busy white');
                                pionSvg.setAttributeNS(null, 'fill', '#FDDDA7');
                            }else {
                                pionSvg.setAttribute('class', 'pion black draggable');
                                parental.setAttribute('class', 'busy black');
                                pionSvg.setAttributeNS(null, 'fill', '#672D2E');
                            }
                        }
                        parental.appendChild(pionSvg);
                    }
                }
            }
        }
        console.log("draw pion")
    }
}



