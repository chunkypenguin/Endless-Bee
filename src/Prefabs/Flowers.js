class Flowers extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, flowerXLeast, flowerXMost) {
        // call Phaser Physics Sprite constructor
        super(scene, Phaser.Math.Between(flowerXLeast, flowerXMost), -100, 'rosebud')
        
        this.parentScene = scene               

        // set up physics sprite
        this.parentScene.add.existing(this)    
        this.parentScene.physics.add.existing(this) 
        this.setVelocityY(velocity)           
        this.setImmovable()                    
        this.newFlower = true          
    }

    update() {
        if(this.newFlower && this.y > 100) {
            this.parentScene.addFlower(this.parent, this.velocity)
            this.newFlower = false
        }

        if(this.y > game.config.height + 100) {
            this.destroy()
        }
    }
}