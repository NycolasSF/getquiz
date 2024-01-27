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
const questions = require('./public/question.json');

let numberPergunta = 0;

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

    // ? PERGUNTAS

    //criar perguntas randons
    io.emit('pergunta', game.addPergunta(questions.perguntas[numberPergunta]))
    io.emit('add-sugar', game.addSugarRandom("a"));
    io.emit('add-sugar', game.addSugarRandom("b"));

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
    //numberPergunta = numberPergunta < questions.perguntas.length ? numberPergunta++ : 0; 
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

server.listen(port, () => console.log(`Connected in port ${port}`));