const express = require('express');
const app = express()

const port = process.env.PORT || 3001
const server = require('http').Server(app)
const io = require("socket.io")(server);

const CreateConfig = require('./controller/CreateConfig')

app.use(express.static("public"));


app.get("/", (req, res)=> {
  res.sendFile(__dirname + "/view/index.html");
});

const game = new CreateConfig();
const questions = require('./public/question.json')

io.on("connection", (socket)=> {
  console.log("Player connected :", socket.id);

  // ? START GAME --> PLAYER ADD - ADD PERGUNTAS
  socket.on('start-game', (namePlayer)=>{

    game.addPlayer(namePlayer, socket.id);

    socket.emit('add-player', { 
      getGame: {
        player: game.gamePlayers,
        sugar: game.gameSugars
      }, 
      idPlayer: socket.id
    });  

    // ? PERGUNTAS random
    //criar perguntas randons
    io.emit('add-sugar', game.addSugarRandom(questions.perguntas[0]));
    io.emit('add-sugar', game.addSugarRandom(questions.perguntas[1]));

    //  ? Emit new player
    socket.broadcast.emit('new-player', { player: game.gamePlayers[socket.id]});
  });

  // ? PLAYER(s)
  socket.on('key-listen', ({id, key})=>{
    let moved = game.movePlayer(id, key);

    socket.emit('player-update', { id: id, playerMoved: moved});
    socket.broadcast.emit('player-update', { id: id, playerMoved: moved });
  });

  socket.on('player-collision', ({idPlayer, idSugar})=>{
    console.log(`Player colided ${idPlayer} with ${idSugar}`);
    
    game.updateScorePlayer(idPlayer);
    game.removeSugar(idSugar);

    socket.emit('player-colided', { colidedIdPlayer: idPlayer, colidedIdSugar: idSugar});
    socket.broadcast.emit('player-colided', { colidedIdPlayer: idPlayer, colidedIdSugar: idSugar, type: 'broadcast' });

  });


  //  ? PERGUNTA(s)
  socket.on('removed-sugar', (idSugar)=>{
    game.removeSugar(idSugar);
  });



  socket.on("disconnect", ()=> {

    console.log("\n \n ");
    console.log("Player disconnected: ", socket.id);
    console.log("\n \n ");

    game.removePlayer(socket.id);
    io.emit("remove-player", socket.id);

  });
});

server.listen(port, () => console.log(`Connected in port 3001`));