class PlayerObject {
    constructor(player, canvasId){
        
        this.id = player.id;
        this.name = player.name; 
        this.score = player.score;
        this.posX = player.position.x;
        this.posY = player.position.y;
        this.width = player.tam.x;
        this.height = player.tam.y;
        
        this.context = null;
        this.screen = {};

        
        this.setAttributes(canvasId);
    }
    setAttributes(canvasId) {
        let canvas = document.getElementById(canvasId);
        this.screen = {
            w: canvas.width,
            h: canvas.height
        }
        this.context = canvas.getContext('2d');
    }
}
class SugarObject {
    constructor(sugar, canvasId) {
        this.id = sugar.id;
        this.posX = sugar.position.x;
        this.posY = sugar.position.y;
        this.width = sugar.tam.x;
        this.height = sugar.tam.y;
        this.timeSugar = sugar.timeSugar
        
        this.tag = sugar.tag

        this.context = null;
        this.screen = {};

        this.setAttributes(canvasId);
    }
    setAttributes(canvasId) {
        let canvas = document.getElementById(canvasId);
        this.screen = {
            w: canvas.width,
            h: canvas.height
        }
        this.context = canvas.getContext('2d');
    }
}