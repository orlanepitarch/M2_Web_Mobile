var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

var dbMongo = require('./databaseModule');


app.get('/', function(req,res){
    res.sendFile(__dirname+'/index.html');
})

/**io.on('connection',function(socket){
 console.log("user connected");
});
*/

http.listen(3000, function(){
    console.log("listening on 3000");
});

/** io.on('connection', function(socket){
    socket.on('chat message', function(msg){
      console.log('message: ' + msg);
    });
  }); */

  io.on('connection', function(socket){
    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
    });
  });

  async function logIn(pseudo,password){
    var joueur = await dbMongo.findAPlayerByPseudo(pseudo);
    if(joueur==false){
      console.log("cas ajout");
        dbMongo.addAPlayer(pseudo,0,password);
        return true;
    }
    else{
      if(joueur.password==password){
        console.log("cas password match");
        return true;
      }
      else{
        console.log("cas password unmatch");
        return false;
      }
    }
    console.log(joueur.pseudo);
}

logIn("Jona","tota");