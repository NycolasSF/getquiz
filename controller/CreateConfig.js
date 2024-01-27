module.exports = class CreateConfig {
    
    constructor(){
        this.gamePlayers = {}
        this.gameSugars = [];
        this.timeSugars = 1;
    }
    
    // ? PLAYERs
    addPlayer(namePlayer, socketId) {
    
        console.log(`Player added: ${namePlayer}`);
        return this.gamePlayers[socketId] = {
            id: socketId,
            name: namePlayer,
            score: 0,
            position: {
                x: Math.ceil(Math.random() * 600),
                y: 230
            },
            tam: {
                x: 30,
                y: 30
            }
        }             
    
    }

    removePlayer(idPlayer){
        delete this.gamePlayers[idPlayer];
    }

    movePlayer(id, key) {
        let player  = this.gamePlayers[id];
        const movedTamX = 10; // ! view GameSetup.js playerCheckCollision
        const movedTamY = 20;// ! view GameSetup.js movePlayer

        if (key === 'ArrowUp') {
            if(player.position.y > 210){

                player.position.y -= movedTamY;
                setTimeout(() => {
                    player.position.y += movedTamY;
                    
                }, 100);
                
                return {
                    x: null,
                    y: player.position.y
                };

            }else{
                return {
                    x: null,
                    y: player.position.y
                };
            
            }
        }

        if (key === 'ArrowLeft') {
            player.position.x -= movedTamX;
            
            return {
                x: player.position.x,
                y: null
            };
        }

        if (key === 'ArrowRight') {
            player.position.x += movedTamX;

            return {
                x: player.position.x,
                y: null
            };
        }

    }
    
    updateScorePlayer(idPlayer){
        this.gamePlayers[idPlayer].score += 1;
    }

    // ? PERGUNTAS
    addSugar(numberRandom,question) {

        let dados = {
            id: `${Math.ceil(Math.random() * 2048)}`,
            position: {
                x: numberRandom,
                y: 0
            },
            tam: {
                x: 24,
                y: 24
            },
            timeSugar: this.timeSugars,
            pergunta: question.pergunta,
            resposta: question.resposta,
            letraA: question.letraA,
            letraB: question.letraB
        }
        
        
        this.timeSugars === 1 ? this.timeSugars = 0.25 : this.timeSugars += 0.25;
        
        console.log(`QTD Sugar: ${this.gameSugars.length}`);
        this.gameSugars.push(dados);
        
        return dados;
    }

    removeSugar(idSugar){
        console.log(`SUGAR REMOVED: ${idSugar} `);
        if (idSugar) {
            let find = this.gameSugars.findIndex(element => element.id === idSugar);
            this.gameSugars.splice(find, 1);            
        }
    }

    addSugarRandom(pergunta){
        if (this.gameSugars.length <= 2){            

            let numberRandom = Math.ceil(Math.random() * 700);
            
            if(this.gamePlayers.length > 0){
                this.gameSugars.forEach((sugar)=>{

                    if (sugar.position.x < numberRandom + sugar.tam.x &&
                        sugar.position.x + sugar.tam.x > numberRandom) {
                            
                            let newRandom = Math.ceil(Math.random() * (numberRandom + sugar.tam.x));
                            console.log(`New Sugar \n New Random ${newRandom}`);
                            return this.addSugar(newRandom,pergunta);
                        
                        }else{

                            return this.addSugar(numberRandom,pergunta);

                        }

                });
            }else{
                return this.addSugar(numberRandom,pergunta);
            }
        }
        //console.log(`Hit max sugars`);
        
        return false;
    }

}