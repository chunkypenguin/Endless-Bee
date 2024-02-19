class FlowersTwo extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, flowerTwoXLeast, flowerTwoXMost) {
        super(scene, Phaser.Math.Between(flowerTwoXLeast, flowerTwoXMost), -100, 'violetbud')
        
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
            this.parentScene.addFlowerTwo(this.parent, this.velocity)
            this.newFlower = false
        }

        if(this.y > game.config.height + 100) {
            this.destroy()
        }
    }
}