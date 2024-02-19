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
        sugar: game.gameSugars,
        pergunta: game.gamePerguntas
      }, 
      idPlayer: socket.id,
    });  

    // ? PERGUNTAS

      io.emit('pergunta', game.addPergunta(questions.perguntas[numberPergunta]))
      io.emit('add-sugar', game.addSugarRandom("a"));
      io.emit('add-sugar', game.addSugarRandom("b"));

    //  ? Emit new player 
    socket.broadcast.emit('new-player', { player: game.gamePlayers[socket.id] });
  });

  // ? PLAYER(s)
  socket.on('key-listen', ({id, key})=>{
    let moved = game.movePlayer(id, key);

    socket.emit('player-update', { id: id, playerMoved: moved});
    socket.broadcast.emit('player-update', { id: id, playerMoved: moved });
  });

  socket.on('player-collision', ({idPlayer, idSugar, tag})=>{
    console.log(`COLISAO: ${idPlayer} com ${tag}`);
    

    if(questions.perguntas[numberPergunta].resposta == tag){
      game.updateScorePlayer(idPlayer);
      game.removeAlternativas();

      socket.emit('player-colided', { colidedIdPlayer: idPlayer, colidedIdSugar: idSugar, tag: tag});
      socket.broadcast.emit('player-colided', { colidedIdPlayer: idPlayer, colidedIdSugar: idSugar, tag: tag, type: 'broadcast' });

      if(numberPergunta < questions.perguntas.length) 
        numberPergunta++ 
      else 
        numberPergunta = 0; 
      
      io.emit('pergunta', game.addPergunta(questions.perguntas[numberPergunta]))
      io.emit('add-sugar', game.addSugarRandom("a"));
      io.emit('add-sugar', game.addSugarRandom("b"));

    }else{
      socket.emit('player-colided', { colidedIdPlayer: idPlayer, colidedIdSugar: idSugar, tag: tag});
      socket.broadcast.emit('player-colided', { colidedIdPlayer: idPlayer, colidedIdSugar: idSugar, tag: tag, type: 'broadcast' });
    }
  });


  //  ? PERGUNTA(s)
  socket.on('removed-sugar', (idSugar)=>{
    game.removeAlternativas();
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