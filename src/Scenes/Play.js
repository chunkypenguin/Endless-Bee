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
        this.load.image('violetbud', 'VioletBudLarge.png')
        this.load.image('violetbloom', 'VioletBloomLarge.png')
        this.load.image('daisybud', 'DaisyBudLarge.png')
        this.load.image('daisybloom', 'DaisyBloomLarge.png')

                // load spritesheet
                this.load.spritesheet('beefly', 'beee.png', {
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

        this.flowerScore = 0

        this.beeWidth = 32
        this.beeHeight = 128
        this.beelocity = 100
        this.beeY = 650
        this.maxBeelocity = 500
        this.beeBounce = 0.5
        this.beeDragX = 1200

        // most recent flower object
        this.recentFlower = 0

        this.roseHit = 0
        this.flowerXOld = 0
        this.flowerX = game.config.width/2
        this.flowerXLeast = this.beeWidth
        this.flowerXMost = game.config.width - this.beeWidth

        this.violetHit = 0
        this.flowerTwoXOld = 0
        this.flowerTwo = 0
        this.flowerTwoX = game.config.width/2
        this.flowerTwoXLeast = this.beeWidth
        this.flowerTwoXMost = game.config.width - this.beeWidth

        this.daisyHit = 0
        this.flowerThree = 0
        this.flowerThreeX = game.config.width/2
        this.flowerThreeXLeast = this.beeWidth
        this.flowerThreeXMost = game.config.width - this.beeWidth
    }

    create() {

        this.canCollide = true
        this.thisFlower = 0
        this.thisFlowerTwo = 0
        this.thisFlowerThree = 0

        // display score
        let scoreConfig = {
            frontFamily: 'Courier',
            fontSize: '72px',
            backgroundColor: '#0BD117',
            color: '#843605',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 150
        }



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

        // set up flower group
        this.flowerTwoGroup = this.add.group({
            runChildUpdate: true // make sure update runs on group children
        })
        // wait a few seconds before spawning flowers
        this.time.delayedCall(this.flowerSpawnDelay + 250, () => { 
            this.addFlowerTwo()
        })

        // set up flower group
        this.flowerThreeGroup = this.add.group({
            runChildUpdate: true // make sure update runs on group children
        })
        // wait a few seconds before spawning flowers
        this.time.delayedCall(this.flowerSpawnDelay + 500, () => { 
            this.addFlowerThree()
        })

        this.score = this.add.text(25, 25, this.flowerScore, scoreConfig)
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
        this.physics.world.collide(this.bee, this.flowerTwoGroup, this.flowerTwoCollision, null, this)
        this.physics.world.collide(this.bee, this.flowerThreeGroup, this.flowerThreeCollision, null, this)

        this.bgImage.tilePositionY -= 8
    }

    // create new flowers and add them to existing flower group
    addFlower() {
        this.flower = new Flowers(this, this.flowerSpeed, this.flowerXLeast, this.flowerXMost)

        if((this.flower.x < this.recentFlower.x + 64) && this.flower.x > this.recentFlower.x){
            this.flower.x += 200
        }

        else if ((this.flower.x > this.recentFlower.x - 64) && this.flower.x < this.recentFlower.x){
            this.flower.x -= 200
        }

        if(this.flower.x < this.beeWidth){
            this.flower.x = this.beeWidth
        }

        if(this.flower.x > this.game.config.width - this.beeWidth){
            this.flower.x = this.game.config.width - this.beeWidth
        }


        // place next flower within range of most recent flower (that way flowers are always bloomable)
        this.flowerXLeast = this.flower.x - 150
        if( this.flowerXLeast < this.beeWidth){
            this.flowerXLeast = this.beeWidth
        }

        this.flowerXMost = this.flower.x + 150

        if( this.flowerXMost > this.game.config.width - this.beeWidth){
            this.flowerXMost = this.game.config.width - this.beeWidth
        }

        this.flowerGroup.add(this.flower)

        this.recentFlower = this.flower
    }

    addFlowerTwo() {
        this.flowerTwo = new FlowersTwo(this, this.flowerSpeed, this.flowerTwoXLeast, this.flowerTwoXMost)

        
        if((this.flowerTwo.x < this.recentFlower.x + 64) && this.flowerTwo.x > this.recentFlower.x){
            this.flowerTwo.x += 200
        }

        else if ((this.flowerTwo.x > this.recentFlower.x - 64) && this.flowerTwo.x < this.recentFlower.x){
            this.flowerTwo.x -= 200
        }

        if(this.flowerTwo.x < this.beeWidth){
            this.flowerTwo.x = this.beeWidth
        }

        if(this.flowerTwo.x > this.game.config.width - this.beeWidth){
            this.flowerTwo.x = this.game.config.width - this.beeWidth
        }

        // place next flower within range of most recent flower (that way flowers are always bloomable)
        this.flowerTwoXLeast = this.flowerTwo.x - 150
        if( this.flowerTwoXLeast < this.beeWidth){
            this.flowerTwoXLeast = this.beeWidth
        }

        this.flowerTwoXMost = this.flowerTwo.x + 150

        if( this.flowerTwoXMost > this.game.config.width - this.beeWidth){
            this.flowerTwoXMost = this.game.config.width - this.beeWidth
        }

        this.flowerTwoGroup.add(this.flowerTwo)

        this.recentFlower = this.flowerTwo
    }

    addFlowerThree() {
        this.flowerThree = new FlowersThree(this, this.flowerSpeed, this.flowerThreeXLeast, this.flowerThreeXMost)


        if((this.flowerThree.x < this.recentFlower.x + 64) && this.flowerThree.x > this.recentFlower.x){
            this.flowerThree.x += 200
        }

        else if ((this.flowerThree.x > this.recentFlower.x - 64) && this.flowerThree.x < this.recentFlower.x){
            this.flowerThree.x -= 200
        }


        if(this.flowerThree.x < this.beeWidth){
            this.flowerThree.x = this.beeWidth
        }

        if(this.flowerThree.x > this.game.config.width - this.beeWidth){
            this.flowerThree.x = this.game.config.width - this.beeWidth
        }
    
        // place next flower within range of most recent flower (that way flowers are always bloomable)
        this.flowerThreeXLeast = this.flowerThree.x - 150
        if( this.flowerThreeXLeast < this.beeWidth){
            this.flowerThreeXLeast = this.beeWidth
        }

        this.flowerThreeXMost = this.flowerThree.x + 150

        if( this.flowerThreeXMost > this.game.config.width - this.beeWidth){
            this.flowerThreeXMost = this.game.config.width - this.beeWidth
        }

        this.flowerThreeGroup.add(this.flowerThree)

        this.recentFlower = this.flowerThree
    }

    flowerCollision(bee, flower) {
        if(this.thisFlower == flower){
            //console.log('already flower')
        }
        else{
            //change sprite texture to bloom
            flower.setTexture('rosebloom')
            this.roseHit++
            this.flowerScore++
            this.score.text = this.flowerScore
            this.thisFlower = flower
        }
    }

    flowerTwoCollision(bee, flowerTwo) {
        if(this.thisFlowerTwo == flowerTwo){
            //console.log('already flower')
        }
        else{
            //change sprite texture to bloom
            flowerTwo.setTexture('violetbloom')
            this.violetHit++
            this.flowerScore++
            this.score.text = this.flowerScore
            this.thisFlowerTwo = flowerTwo
        }
    }

    flowerThreeCollision(bee, flowerThree) {
        if(this.thisFlower == flowerThree){
            //console.log('already flower')
        }
        else{
            //change sprite texture to bloom
            flowerThree.setTexture('daisybloom')
            this.daisyHit++
            if(this.daisyHit > 9){
                this.flowerScore += 2
            }
            else{
                this.flowerScore++
            }

            this.score.text = this.flowerScore
            this.thisFlower = flowerThree
        }
    }
}