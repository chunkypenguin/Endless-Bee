class FlyTraps extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, beeWidth, beeHeight) {
        // call Phaser Physics Sprite constructor
        // scene, spawn point (X(between right and left side of screen), Y( set to top of screen), etc, etc)
        super(scene, Phaser.Math.Between(beeWidth, game.config.width - beeWidth), -100, 'flytrap')
        
        this.parentScene = scene               // maintain scene context

        // set up physics sprite
        this.parentScene.add.existing(this)    // add to existing scene, displayList, updateList
        this.parentScene.physics.add.existing(this) // add to physics system
        this.setVelocityY(velocity)            // make it go!
        this.setImmovable()                    
        //this.tint = Math.random() * 0xFFFFFF   // randomize tint
        this.newFlyTrap = true                 // custom property to control barrier spawning
    }

    update() {
        // add new barrier when existing barrier hits center X
        if(this.newFlyTrap && this.y > centerY/2) {
            // (recursively) call parent scene method from this context
            this.parentScene.addBarrier(this.parent, this.velocity)
            this.newFlyTrap = false
        }

        // destroy paddle if it reaches the left edge of the screen
        if(this.y > game.config.height) {
            this.destroy()
        }
    }
}