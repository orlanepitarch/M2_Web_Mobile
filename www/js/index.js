/*import {Damier} from "./damier.js";

 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        let login = new log(); 
        let affichage = new Affichage();
        let jeu;
        let pseudo;
        let gameType="";
     
        // on se connecte sur le port 28400 (notre serveur node) quand le device est pret
        var socket = io.connect('http://192.168.1.13:28400');
        //on affiche un damier pour l'esthétisme et montrer que notre plateforme permet de jouer aux dames :
        new Damier(10,"white");

        //connexion / inscription d'un utilisateur :
        let formulaire = document.getElementById("formConnexion");
        formulaire.onsubmit = function() {
            pseudo = formulaire.pseudo.value;
            password = formulaire.mdp.value;
            socket.emit("login", pseudo, password);
            //annule le rafraichissement de la page :
            return false;
        };

        //lance le jeu en ligne (lance le matchmaking, l'attente d'un adversaire) :
        document.getElementById("onLine").onclick = function() {
            socket.emit('nouveau_client', {socketId: socket.id, pseudo: pseudo});
            gameType = "onLine";
        }

        //annule le matchmaking :
        document.getElementById("cancelMatchMaking").onclick = function() {
            socket.emit('cancelMatchMaking');
            affichage.cancelMatchMaking();
        }

        //lance le jeu en local :
        document.getElementById("local").onclick = function() {
            gameType = "local";
            document.getElementById('gameType').style.display = "none";
            document.getElementById('cancelLocal').style.display = "block";
            jeu = new Game(gameType, "white");
        }

        //annule le jeu en local :
        document.getElementById('cancelLocal').onclick = function() {
            document.getElementById('cancelLocal').style.display = "none";
            login.accueil();
        }

        //appelle l'actualisation ou l'envoi des données des meilleurs scores
        document.getElementById("displayScore").onclick = function() {
            socket.emit("displayScore");
        }

        //affiche ou actualise le tableau des scores en fonction des données reçues
        socket.on("displayScore", function(data) {
            affichage.displayScore(data);
        })

        //si le mot de passe est mauvais, on l'affiche au client
        socket.on("mauvaisMDP", function() {
            login.mauvaisMDP();
        });

        //si la connexion a réussi, on affiche les boutons pour pouvoir jouer chez le client :
        socket.on('connexionSuccess', function(data) {
            login.connexionSuccess();
            pseudo=data.pseudo;
        });

        //si le matchmaking est en cours, on l'annonce au client :
        socket.on('waitingAdversaire', function() {
            login.waitingScreen();
        });

        //si un adversaire a été trouvé, on l'annonce au client :
        socket.on('findAdversaire', function(data) {
            //permet de retrouver la couleur du joueur en fonction de son pseudo (la couleur est une clef dans data)
            let couleurJoueur;
            for (let color in data) { 
                if (data.hasOwnProperty(color)) { 
                    if (data[color] === pseudo) 
                    couleurJoueur = color;
                } 
            } 
            login.findAdversaire(data, couleurJoueur);
            //refresh du damier :
            jeu = new Game(gameType, couleurJoueur);
            
            let joueur;
            if(couleurJoueur == "black") {
                joueur = "noirs";
            } else {
                joueur = "blancs";
            }
            alert("Vous jouez les pions "+joueur);

        });
          
        //si l'adversaire s'est déconnecté, on prévient le client :
        socket.on("deconnexionAdversaire", function() {
            alert("Votre adversaire s'est déconnecté");
            login.adversaireDeco();
        });

        //permet d'envoyer au serveur le mouvement ou la prise réalisée ou si la victoire est détectée par le client :
        let elm = document.getElementById("damier");
        elm.addEventListener("prise", function(event) {
            socket.emit("priseAdverse", event.detail, jeu.tailleDamier, socket.id);
        });
        elm.addEventListener("move", function(event) {
            socket.emit("moveAdverse", event.detail, jeu.tailleDamier, socket.id);
        });
        elm.addEventListener("win", function(event) {
            socket.emit("win", {couleur: event.detail.couleurJoueur, pseudo: pseudo, socketID: socket.id});
        });

        //affiche quelle couleur a gagné sur les deux écrans et la possibilité de rejouer (relance le matchmaking)
        socket.on('win', function(data) {
            let joueur;
            if(data == "black") {
                joueur = "noirs";
            }else {
                joueur = "blancs";
            }
            let replay = window.confirm("Partie Terminée : Les " + joueur +" ont gagnés ! Voulez vous rejouer ?")
            if (replay) {
                login.accueil();
                socket.emit('nouveau_client', {socketId: socket.id, pseudo: pseudo});
                gameType = "onLine";
            }else {
                login.accueil();
            }
        })
        
        //permet d'afficher le mouvement ou la prise réalisée par l'adversaire :
        socket.on("priseAdverse", function(data) {
            jeu.priseAdverse(data.detailPrise);
        });
        socket.on("moveAdverse", function(data) {
            jeu.moveAdverse(data.detailMove);
        });
    }
};

app.initialize();



