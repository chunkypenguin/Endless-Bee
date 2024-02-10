class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    preload() {
        this.load.path = './assets/'
        this.load.image('bee', 'BensonBee2.png')
        this.load.image('greenbg', 'GreenBG.png')
        this.load.image('flytrap', 'FlyTrap.png')
        this.load.image('rosebud', 'LargeRoseBud.png')
        this.load.image('rosebloom', 'LargeRoseBloom.png')

                // load spritesheet
                this.load.spritesheet('beefly', 'BeeSpriteSheet.png', {
                    frameWidth: 64,
                    frameHeight: 64,
                    startFrame: 0,
                    endFrame: 6
                })
    }

    init(){
        this.flowerSpawnDelay = 2000
        this.flowerSpeed = 500
        this.flowerSpeedMax = 1000


        //this.flowerY = game.config.height - 100

        //flytrap variables
        /*
        this.flyTrapSpawnDelay = 2000
        this.flyTrapSpeed = 600
        this.flyTrapSpeedMax = 1000
        */

        this.beeWidth = 32
        this.beeHeight = 128
        this.beelocity = 100
        this.beeY = 650
        this.maxBeelocity = 500
        this.beeBounce = 0.5
        this.beeDragX = 1200

        this.flowerX = game.config.width/2
        this.flowerXLeast = this.beeWidth
        this.flowerXMost = game.config.width - this.beeWidth
    }

    create() {
        // place tile sprite
        this.bgImage = this.add.tileSprite(0, 0, 640, 960,
            'greenbg').setOrigin(0,0)

        // animation configuration
        this.anims.create({
            key: 'flying',
            frames: this.anims.generateFrameNumbers('beefly', {
                start: 0, end: 6, first: 0}),
                frameRate: 45,
                repeat: -1
                //yoyo: true
        })

        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys()

        // set up player paddle (physics sprite) and set properties
        //this.bee = this.physics.add.sprite(centerX, this.beeY, 'bee').setOrigin(0.5)
        this.bee = this.physics.add.sprite(centerX, this.beeY, 'beefly').setOrigin(0.5)
        this.bee.anims.play('flying')
        this.bee.setCollideWorldBounds(true)
        this.bee.setBounce(this.beeBounce)
        this.bee.setImmovable()
        this.bee.setMaxVelocity(this.maxBeelocity,0 )
        this.bee.setDragX(this.beeDragX)
        this.bee.setDepth(1) // ensures that paddle z-depth remains above shadow paddles
        this.bee.destroyed = false // custom property to track paddle life
        this.bee.setBlendMode('SCREEN') // set a WebGL blend mode

        // set up flower group
        this.flowerGroup = this.add.group({
            runChildUpdate: true // make sure update runs on group children
        })
        // wait a few seconds before spawning flowers
        this.time.delayedCall(this.flowerSpawnDelay, () => { 
            this.addFlower()
        })

        /*
        // set up flytrap group
        this.barrierGroup = this.add.group({
            runChildUpdate: true // make sure update runs on group children
        })
        // wait a few seconds before spawning flytraps
        this.time.delayedCall(this.flyTrapSpawnDelay, () => { 
            this.addBarrier()
        })
        */

    }



    update() {
        // utiliize right and left arrow keys to move bee side to side
        if(cursors.right.isDown) {
            this.bee.body.velocity.x += this.beelocity
        } else if(cursors.left.isDown) {
            this.bee.body.velocity.x -= this.beelocity
        }

        // check for collisions
        this.physics.world.collide(this.bee, this.flowerGroup, this.flowerCollision, null, this)

        this.bgImage.tilePositionY -= 3
    }

    // create new flowers and add them to existing flower group
    addFlower() {
        let flower = new Flowers(this, this.flowerSpeed, this.flowerXLeast, this.flowerXMost)

        // place next flower within range of most recent flower (that way flowers are always bloomable)
        this.flowerXLeast = flower.x - 150
        if( this.flowerXLeast < this.beeWidth){
            this.flowerXLeast = this.beeWidth
        }

        this.flowerXMost = flower.x + 150

        if( this.flowerXMost > this.game.config.width - this.beeWidth){
            this.flowerXMost = this.game.config.width - this.beeWidth
        }

        this.flowerGroup.add(flower)
    }

    /*
    // create new barriers and add them to existing barrier group
    addBarrier() {
        let speedVariance =  Phaser.Math.Between(0, 50)
        let barrier = new FlyTraps(this, this.flyTrapSpeed - speedVariance, this.beeWidth, this.beeHeight)
        this.barrierGroup.add(barrier)
    }
    */

    flowerCollision(bee, flower) {

        //change sprite texture to bloom
        flower.setTexture('rosebloom')
    }

}