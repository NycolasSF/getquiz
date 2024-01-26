class Player extends PlayerObject{
    constructor(players, canvasID){
        //View GameObjets.js
        super(players, canvasID);

        this.keys = {
            ArrowUp: false,
            ArrowLeft: false,
            ArrowRight: false
        }


        this.globalID = undefined;
        this.getElements();
    }

    getElements(){
        this.globalID = localStorage.getItem('globalID');
    }
    
    draw(){

        let img = new Image()

        if (this.id === this.globalID){      
            img.src = './assets/coffee-skin.png';
        } else {
            img.src = './assets/coffee-skin-2.png';
        }

        let moveX = this.screenInfinite(this.screen.w, Math.round(this.posX));

        this.context.drawImage(img, moveX, Math.round(this.posY))
    }


    screenInfinite(x, y) {
        return ((y % x) + x) % x
    }

}

class Sugar extends SugarObject {
    constructor(sugar, canvasID) {

        //View GameObjets.js
        super(sugar, canvasID);

        this.speed = 18;
    }
//add imagem diferente para pergunta (a) , (b)
    draw() {
        let img = new Image()
        img.src = './assets/sugar.png';

        let moveX = this.screenInfinite(this.screen.w, Math.round(this.posX));
        this.context.drawImage(img, moveX, Math.round(this.posY))
    }

    screenInfinite(x, y) {
        return ((y % x) + x) % x
    }

    update(time) {
        let calc = this.posY + (time * this.speed);
        this.posY = calc < this.screen.h ? calc + this.timeSugar : 0;
    }

}