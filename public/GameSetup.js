function GameSetup(canvasId) { // create and loop in gmae
    let canvas = null;
    let context = null;

    let gamePlayers = {};
    let gameSugars = [];
    let perguntaAtual = {}

    let oldTimeStamp = 0;

    let idPlayer = undefined;
    let pause = false

    function start(getGame) {
        console.info(">> Start game");
        
        canvas = document.getElementById(canvasId);
        context = canvas.getContext('2d');

        addPlayers(getGame.player);
        addSugars(getGame.sugar);
        
        console.info(">> Start gameLoop");    
        return window.requestAnimationFrame((timeStamp) => { gameLoop(timeStamp) });
    }

    function gameLoop(timeStamp) {
        
        let time = (timeStamp - oldTimeStamp) / 1000;
        oldTimeStamp = timeStamp;

        clearCanvas();  

        playersScore();

        for (const idPlayer in gamePlayers){
            const player = gamePlayers[idPlayer]; 
            player.draw();
        }
            
        gameSugars.forEach((sugar) => {
            sugar.update(time);
            sugar.draw(sugar.tag);
        });

        if(!pause)
            window.requestAnimationFrame((timeStamp) => gameLoop(timeStamp));
        else 
            window.cancelAnimationFrame((timeStamp) => gameLoop(timeStamp))
    }   

    // ? OBJ --> PLAYERS
    function setPlayer(getIdPlayer) {
        if (getIdPlayer) {
            localStorage.setItem('globalID', getIdPlayer);
            idPlayer = getIdPlayer;
        }
    }
    function getPlayer() {
       return idPlayer;
    }

    function addPlayers(objectsPlayers) {   
        for (const idPlayer in objectsPlayers) {
            const player = objectsPlayers[idPlayer]
            gamePlayers[idPlayer] = new Player(player, canvasId)
        }
    }

    function addPlayer(player) {
       gamePlayers[player.id] = new Player(player, canvasId);
    }

    function removePlayer(idPlayer) {
        if (idPlayer) {
            delete gamePlayers[idPlayer]
        }
    }

    function movePlayer({ id, playerMoved}) {
        
        if(playerMoved.x != null){
            gamePlayers[id].posX = playerMoved.x;
        }else{
            gamePlayers[id].posY = playerMoved.y;
            setTimeout(()=>{
                gamePlayers[id].posY = playerMoved.y + 20;
            }, 150);
        }

    }

    function playerCheckCollision(getIdPlayer) {
        let colided = {
            collision: false
        };

        if (getIdPlayer === idPlayer){
            
            let player = gamePlayers[getIdPlayer];
    
            gameSugars.forEach((sugar) => {
                sugar = {
                    ...sugar,
                    x: Math.round(sugar.posX),
                    y: Math.round(sugar.posY),
                }

    
                if (player.posX < sugar.x + sugar.width &&
                    player.posX + player.width + 10 > sugar.x &&
                    player.posY < sugar.y + sugar.height &&
                    player.posY + player.height > sugar.y) {
                        
                    console.log(`COLISAO: ${ sugar.tag } and player ${ player.name }`);
                    return colided = {
                        collision: true,
                        idSugar: sugar.id,
                        idPlayer: getIdPlayer,
                        tag: sugar.tag
                    }
                }
            });
        }
        return colided;
    }

    function playerColided({colidedIdPlayer, colidedIdSugar, tag}){
        let acerto = document.getElementById('acerto');
        let error = document.getElementById('erro')

        if(tag == perguntaAtual.resposta){
            gamePlayers[colidedIdPlayer].score += 1;

            error.style.display='none'
            acerto.style.display='block'

            removeAlternativas();
            setTimeout(()=>{acerto.style.display="none"},500)
        }else{
            acerto.style.display='none'
            error.style.display = 'block'
        }
    }

    function playersScore() {
        let points = document.getElementById('points');
        let score = [];


        points.innerHTML = `
            <tr>
                <th>Alunos</th>
                <th>Pontos</th>
            </tr>
        `

        for (const id in gamePlayers) {
            const player = {
                name: gamePlayers[id].name,
                score: gamePlayers[id].score
            }
            score.push(player)
        }

        for (let i = 0; i < score.length; i++) {
            points.innerHTML += `
            <tr>
                <td>${score[i].name}</td>
                <td>${score[i].score}</td>
            </tr>
            `
        }

    }

    // ? OBJ --> PERGUNTA
    function addPergunta(perguntaPlayer) {
        let pergunta = document.getElementById('pergunta');
        let letraA = document.getElementById('letraA');
        let letraB = document.getElementById('letraB');

        console.log(`Pergunta ALL:`, perguntaPlayer);

        pergunta.innerText = perguntaPlayer.pergunta
        letraA.innerText = perguntaPlayer.letraA
        letraB.innerText = perguntaPlayer.letraB
        
        perguntaAtual = perguntaPlayer

    }

    function addSugar(sugar) {
        console.log(`QTD alternativa: ${gameSugars.length} `);
        
        if(sugar.id && gameSugars.length >= 2){
            removeAlternativas()
        }else{
            gameSugars.push(new Sugar(sugar, canvasId))
        }
    }
    
    function addSugars(objectsSugars) {
        if(objectsSugars){
            for (const idSugar in objectsSugars) {
                const sugar = objectsSugars[idSugar]
                console.log(sugar);

                gameSugars.push(new Sugar(sugar, canvasId));
            }
        }
    }

    function removeSugar(idSugar) {
        if (idSugar) {
            console.log(`ALTERNATIVA REMOVED: ${idSugar}`);
            
            let find = gameSugars.findIndex(element => element.id === idSugar)
            gameSugars.splice(find, 1);
        }
    }

    function removeAlternativas() {
        while(gameSugars.length) {
            gameSugars.pop();
        }
    }
    
    function clearCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);        
    }

    return{
        GameSetup,
        gameSugars,
        start,
        setPlayer,
        getPlayer,
        addPlayer,
        addPlayers,
        removePlayer,
        playerCheckCollision,
        playerColided,
        movePlayer,
        addSugar,
        addPergunta,
        addSugars,
        removeAlternativas,
        removeSugar,
        clearCanvas

    }

}
