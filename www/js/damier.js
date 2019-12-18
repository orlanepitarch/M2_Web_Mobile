class Damier{

    constructor(taille) {
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
        this.drawDamierSvg();
        this.drawPionSvg();
    }

    drawDamierSvg(){
        let svg = document.querySelector('#damier');
        let colorVerifier = '#4b170d';
        //contruction damier dynamique
        for (let i = 0 ; i < this.taille ; i++) {
            for (let j = 0; j < this.taille; j++) {
                let newx = 50 * i;
                let newy = 50 * j;
                let caseSvg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
                caseSvg.setAttribute('id', +'/'+j.toString()+i.toString());
                caseSvg.setAttributeNS(null, 'width', '50');
                caseSvg.setAttributeNS(null, 'height', '50');
                //datermine la couleur d'une case selon
                //si la taille du damier et pair ou impair
                if(this.taille%2 == 1){
                    if(colorVerifier == '#e5ca9a'){
                        colorVerifier = '#4b170d';
                        caseSvg.setAttributeNS(null, 'fill', '#4b170d');
                    } else {
                        colorVerifier = '#e5ca9a';
                        caseSvg.setAttributeNS(null, 'fill', '#e5ca9a');
                    }
                } else {
                     if(colorVerifier == '#e5ca9a'){
                         if(j == this.taille-1){
                             colorVerifier = '#e5ca9a';
                         } else {
                             colorVerifier = '#4b170d';
                         }
                        caseSvg.setAttributeNS(null, 'fill', '#4b170d');
                    } else {
                         if(j == this.taille-1){
                             colorVerifier = '#4b170d';
                         } else {
                             colorVerifier = '#e5ca9a';
                         }
                        caseSvg.setAttributeNS(null, 'fill', '#e5ca9a');
                    }
                }

                caseSvg.setAttributeNS(null, 'stroke-width', '2');
                caseSvg.setAttributeNS(null, 'stroke', 'black');
                caseSvg.setAttributeNS(null, "x", newx.toString());
                caseSvg.setAttributeNS(null, "y", newy.toString());
                svg.appendChild(caseSvg);
            }
        }
    }

    drawPionSvg(){
        let rayon = 18;
        let svg = document.querySelector('#damier');
        let colorVerifier = '#672D2E' //#FDDDA7
        for(let j = 0; j < this.taille; j++){
            for(let i = 0; i < this.taille; i++){
                console.log(this.taille-3)
                //2 premières ligne et 2 dernières lignes remplises
                if(j==0 || j==1 || j==this.taille-2 || j==this.taille-1){

                    //on calcule les coordonnées
                    let newcx = 50 * i + 25;
                    let newcy = 50 * j + 25;
                    let pionSvg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    pionSvg.setAttribute('class', 'pionSvg');
                    pionSvg.setAttributeNS(null, 'r', rayon.toString());
                    pionSvg.setAttributeNS(null, 'cx', newcx.toString());
                    pionSvg.setAttributeNS(null, 'cy', newcy.toString());
                    if(j==0 || j==1){
                        pionSvg.setAttributeNS(null, 'fill', '#672D2E');
                    } else if( j == this.taille-2 || j==this.taille-1){
                        pionSvg.setAttributeNS(null, 'fill', '#FDDDA7');
                    }
                    pionSvg.setAttributeNS(null, 'stroke-width', '2');
                    pionSvg.setAttributeNS(null, 'stroke', 'black');
                    svg.appendChild(pionSvg);
                }
            }
        }
    }
}



