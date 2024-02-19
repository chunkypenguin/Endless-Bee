class Spider extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, spiderDifMod, randomX) {
        
        super(scene, randomX, -100, 'spider')
        
        this.parentScene = scene             

        this.spiderMod = spiderDifMod

        // set up physics sprite
        this.parentScene.add.existing(this)    
        this.parentScene.physics.add.existing(this) 
        this.setVelocityY(velocity) 
        //if on right
        if(randomX >= 320){
            this.setVelocityX(-velocity + 400) 
        }
        else{
            this.setVelocityX(velocity - 400)
        }
        this.setImmovable()                    
        this.newSpider = true    
    }

    update() {
        if(this.newSpider && this.y > (game.config.height/2) * this.spiderMod) {
            this.parentScene.addSpider(this.parent, this.velocity)
            this.newSpider = false
        }

        if(this.y > game.config.height + 100) {
            this.destroy()
        }
    }
}