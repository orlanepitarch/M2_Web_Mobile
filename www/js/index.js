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
        //this.startGame();
    

        var login = new log(); 
        
        // on se connecte sur le port 28400 (notre serveur node) quand le device est pret
        var socket = io.connect('http://localhost:28400');
     
        // Quand on reçoit un message (d'une autre personne), on l'insère dans la page
        socket.on('message', function(data) {
            insereMessage(data.message);
        })

        var formulaire = document.getElementById("formConnexion");

        formulaire.onsubmit = function() {
            pseudo = formulaire.pseudo.value;
            password = formulaire.mdp.value;
            socket.emit("login", pseudo, password);
            return false;
        };

        socket.on("mauvaisMDP", function() {
            login.mauvaisMDP();
        });
        socket.on('connexionSuccess', function() {
            login.connexionSuccess();
            socket.emit('nouveau_client', socket.id);
        });

        socket.on('waitingAdversaire', function() {
            login.waitingScreen();
        });

        socket.on('findAdversaire', function() {
            console.log("find adversaire");
            login.findAdversaire();
        });

    
        // détection du click sur le bouton Envoyer signalant qu'un message a été envoyé
        document.getElementById('envoiMessage').onclick = function() {
            var message = document.getElementById('message').value;
            socket.emit('message', message, socket.id); // Transmet le message à son duo (retrouvé par le serveur)
            insereMessage(message);
            document.getElementById('message').value='';
        };
            
        socket.on("deconnexionAdversaire", function(data) {
            console.log("adv deco");
        })
        // Ajoute un message dans la page
        function insereMessage(message) {
            var p = document.createElement("p");
            p.innerHTML = message;
            document.getElementById('zone_chat').appendChild(p);
        }  
    },
    startGame: function () {
        //game = new Game();
    }
};

app.initialize();



