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
            img.src = './assets/jaozin.png';
        } else {
            img.src = './assets/jaozin-2.png';
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
        // View GameObjets.js 
        super(sugar, canvasID);

        this.speed = 10;
    }
//add imagem diferente para pergunta (a) , (b)
    draw(tag) {
        let img = new Image()
        if(tag) 
            if(tag == "a")
                img.src = './assets/letra-a-draw.png';
            else
                img.src = './assets/letra-b-draw.png';
        
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