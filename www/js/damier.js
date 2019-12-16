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
        this.drawSvg();
    }

    drawSvg(){
        let svg = document.querySelector('#damier');
        let colorVerifier = '#4b170d';
        //contruction damier dynamique
        for (let i = 0 ; i < this.taille ; i++) {
            for (let j = 0; j < this.taille; j++) {
                let newx = 50 * i;
                let newy = 50 * j;
                let caseSvg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
                caseSvg.setAttribute('id', i.toString()+j.toString());
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

}

