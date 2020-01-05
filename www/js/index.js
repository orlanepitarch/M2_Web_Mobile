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
        var login = new log(); 
        var jeu;
        let pseudo;
        // on se connecte sur le port 28400 (notre serveur node) quand le device est pret
        var socket = io.connect('http://192.168.1.22:28400');
        new Damier(10,"white");
        var gameType="";

        var formulaire = document.getElementById("formConnexion");

        formulaire.onsubmit = function() {
            pseudo = formulaire.pseudo.value;
            password = formulaire.mdp.value;
            socket.emit("login", pseudo, password);
            return false;
        };

        document.getElementById("onLine").onclick = function() {
            socket.emit('nouveau_client', {socketId: socket.id, pseudo: pseudo});
            gameType = "onLine";
        }

        document.getElementById("vsIA").onclick = function() {
            
        }

        document.getElementById("local").onclick = function() {
            gameType = "local";
            document.getElementById('gameType').style.display = "none";
            document.getElementById('cancelLocal').style.display = "block";
            jeu = new Game(gameType, "white");
        }

        document.getElementById('cancelLocal').onclick = function() {
            document.getElementById('cancelLocal').style.display = "none";
            login.accueil();
        }

        document.getElementById("cancelMatchMaking").onclick = function() {
            socket.emit('cancelMatchMaking');
            document.getElementById('gameType').style.display = "block";
            if (document.getElementById('displayMessage').childElementCount == 1 ) {
                if(document.getElementById("waiting") != null) {
                    document.getElementById('displayMessage').removeChild(document.getElementById("waiting"));
                }
            }
            document.getElementById("cancelMatchMaking").style.display = "none";
        }

        socket.on("mauvaisMDP", function() {
            login.mauvaisMDP();
        });

        socket.on('connexionSuccess', function(data) {
            login.connexionSuccess();
            pseudo=data.pseudo;
        });

        socket.on('waitingAdversaire', function() {
            login.waitingScreen();
        });

        socket.on('findAdversaire', function(data) {
            login.findAdversaire(data);
            let couleurJoueur;
            for (let prop in data) { 
                if (data.hasOwnProperty(prop)) { 
                    if (data[prop] === pseudo) 
                    couleurJoueur = prop;
                } 
            } 
            //refresh du damier :
            jeu = new Game(gameType, couleurJoueur);
            
            let joueur;
            if(couleurJoueur == "black") {
                joueur = "noirs";
            }
            else {
                joueur = "blancs";
            }
            alert("Vous jouez les pions "+joueur);
            
           
        });
          
        socket.on("deconnexionAdversaire", function() {
            alert("Votre adversaire s'est déconnecté");
            login.adversaireDeco();
        });

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

        socket.on('win', function(data) {
            let joueur;
            if(data == "black") {
                joueur = "noirs";
            }
            else {
                joueur = "blancs";
            }
            let replay = window.confirm("Partie Terminée : Les " + joueur +" ont gagnés ! Voulez vous rejouer ?")
            if (replay) {
                login.accueil();
                socket.emit('nouveau_client', {socketId: socket.id, pseudo: pseudo});
                gameType = "onLine";
            }
            else {
                login.accueil();
            }
        })
          
        socket.on("priseAdverse", function(data) {
            jeu.priseAdverse(data.detailPrise);
        });

        socket.on("moveAdverse", function(data) {
            console.log("move adv")
            console.log(data.detailMove)
            jeu.moveAdverse(data.detailMove);
        });
    }
};

app.initialize();



