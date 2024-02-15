class FlowersTwo extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, flowerTwoXLeast, flowerTwoXMost) {
        // call Phaser Physics Sprite constructor
        // scene, spawn point (X(between right and left side of screen), Y( set to top of screen), etc, etc)
        //super(scene, Phaser.Math.Between(beeWidth, game.config.width - beeWidth), -100, 'rosebud')
        super(scene, Phaser.Math.Between(flowerTwoXLeast, flowerTwoXMost), -100, 'violetbud')
        
        this.parentScene = scene               // maintain scene context

        // set up physics sprite
        this.parentScene.add.existing(this)    // add to existing scene, displayList, updateList
        this.parentScene.physics.add.existing(this) // add to physics system
        this.setVelocityY(velocity)            // make it go!
        this.setImmovable()                    
        //this.tint = Math.random() * 0xFFFFFF   // randomize tint
        this.newFlower = true                 // custom property to control barrier spawning
    }

    update() {
        // add new barrier when existing barrier hits center X
        if(this.newFlower && this.y > 100) {
            // (recursively) call parent scene method from this context
            this.parentScene.addFlowerTwo(this.parent, this.velocity)
            this.newFlower = false
        }

        // destroy paddle if it reaches the left edge of the screen
        if(this.y > game.config.height + 100) {
            this.destroy()
        }
    }
}