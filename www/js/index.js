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
        var socket = io.connect('http://localhost:28400');
        new Damier(10);
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
            jeu = new Game(gameType, "white");
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
            alert("Vous jouez les pions "+couleurJoueur);
            
           
        });
          
        socket.on("deconnexionAdversaire", function() {
            alert("Votre adversaire s'est déconnecté");
            login.adversaireDeco();
        });

        let elm = document.getElementById("damier");
        elm.addEventListener("prise", function(event) {
            socket.emit("priseAdverse", event.detail, socket.id);
            console.log(event.detail);
        });
        elm.addEventListener("move", function(event) {
            if(document.getElementById(event.detail.nouvellePosition).classList.contains(jeu.couleurJoueur)) {
                socket.emit("moveAdverse", event.detail, socket.id);
            }
            console.log(event.detail);
        });
          
        socket.on("priseAdverse", function(data) {
            console.log(data.detailPrise);
            jeu.priseAdverse(data.detailPrise);
        });

        socket.on("moveAdverse", function(data) {
            console.log(data.detailMove);
            jeu.moveAdverse(data.detailMove);
        });
    }
};

app.initialize();



