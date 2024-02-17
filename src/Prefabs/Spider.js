class Spider extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, spiderXLeast, spiderXMost, randomX) {
        // call Phaser Physics Sprite constructor
        
        super(scene, randomX, -100, 'spider')
        
        this.parentScene = scene               // maintain scene context

        // set up physics sprite
        this.parentScene.add.existing(this)    // add to existing scene, displayList, updateList
        this.parentScene.physics.add.existing(this) // add to physics system
        this.setVelocityY(velocity) 
        //if on right
        if(randomX >= 320){
            this.setVelocityX(-velocity + 400) 
        }
        else{
            this.setVelocityX(velocity - 400)
        }
          // make it go!
        this.setImmovable()                    
        //this.tint = Math.random() * 0xFFFFFF   // randomize tint
        this.newSpider = true                 // custom property to control barrier spawning
    }

    update() {
        // add new barrier when existing barrier hits center X
        if(this.newSpider && this.y > 500) {
            // (recursively) call parent scene method from this context
            this.parentScene.addSpider(this.parent, this.velocity)
            this.newSpider = false
        }

        // destroy paddle if it reaches the left edge of the screen
        if(this.y > game.config.height + 100) {
            this.destroy()
        }
    }
}