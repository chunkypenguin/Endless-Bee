class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init(){

        this.flowerSpawnDelay = 1000
        this.flowerSpeed = 500
        this.flowerSpeedMax = 1000

        this.flowerScore = 0

        this.beeWidth = 32
        this.beeHeight = 128
        this.beelocity = 125
        this.beeY = 650
        this.maxBeelocity = 500
        this.beeBounce = 0.5
        this.beeDragX = 1200

        this.spiderSpawnDelay = 5000
        this.spiderDifMod = 2
        this.spiderSpeed = 650
        this.spiderXLeast = this.beeWidth
        this.spiderXMost = game.config.width - this.beeWidth

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
        this.pickUpSound = this.sound.add('pickup', {volume: 0.25, loop: false})
        
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

        // player Bee properties
        this.bee = this.physics.add.sprite(centerX, this.beeY, 'beefly').setOrigin(0.5)
        this.bee.anims.play('flying')
        this.bee.setCollideWorldBounds(true)
        this.bee.setBounce(this.beeBounce)
        this.bee.setImmovable()
        this.bee.setMaxVelocity(this.maxBeelocity,0 )
        this.bee.setDragX(this.beeDragX)
        this.bee.setDepth(1)
        this.bee.destroyed = false 
        this.bee.setBlendMode('SCREEN')



        
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
            runChildUpdate: true 
        })
        // wait a few seconds before spawning flowers
        this.time.delayedCall(this.flowerSpawnDelay + 250, () => { 
            this.addFlowerTwo()
        })

        
        // set up flower group
        this.flowerThreeGroup = this.add.group({
            runChildUpdate: true 
        })
        // wait a few seconds before spawning flowers
        this.time.delayedCall(this.flowerSpawnDelay + 500, () => { 
            this.addFlowerThree()
        })

        

        this.spiderGroup = this.add.group({
            runChildUpdate: true 
        })
        this.time.delayedCall(this.spiderSpawnDelay, () => { 
            this.addSpider()
        })
        
        this.timer = this.time.addEvent({
            delay: 10000,
            callback: this.spiderMod,
            callbackScope: this,
            loop: true
        })

        this.score = this.add.text(25, 25, this.flowerScore, scoreConfig, {depth: 2})
    }

    update() {

        if(!this.bee.destroyed) {
            // utiliize right and left arrow keys to move bee side to side
            if(cursors.right.isDown) {
                this.bee.body.velocity.x += this.beelocity
            } else if(cursors.left.isDown) {
                this.bee.body.velocity.x -= this.beelocity
        }
        }


        // check for collisions

        this.physics.world.collide(this.bee, this.spiderGroup, this.spiderCollision, null, this)

        this.physics.world.collide(this.bee, this.flowerGroup, this.flowerCollision, null, this)
        this.physics.world.collide(this.bee, this.flowerTwoGroup, this.flowerTwoCollision, null, this)
        this.physics.world.collide(this.bee, this.flowerThreeGroup, this.flowerThreeCollision, null, this)

        this.bgImage.tilePositionY -= 3
    }


    spiderMod() {
        if(this.spiderDifMod >= 0.25){
            this.spiderDifMod -= 0.2
        }

    }

    addSpider() {

        this.randomX = Phaser.Math.Between(this.spiderXLeast, this.spiderXMost)
        
        this.spider = new Spider(this, this.spiderSpeed, this.spiderDifMod, this.randomX )

        this.spiderGroup.add(this.spider)
        this.spider.depth = 1
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

        // if this flower spawns overlapping the right side of previous flower, push to the right
        if((this.flowerTwo.x < this.recentFlower.x + 64) && this.flowerTwo.x > this.recentFlower.x){
            this.flowerTwo.x += 200
        }
        // if this flower spawns overlapping the left side of previous flower, push to the left
        else if ((this.flowerTwo.x > this.recentFlower.x - 64) && this.flowerTwo.x < this.recentFlower.x){
            this.flowerTwo.x -= 200
        }

        // if this flower spawns near the left border, push it to the right
        if(this.flowerTwo.x < this.beeWidth){
            this.flowerTwo.x = this.beeWidth
        }
        // if this flower spawns near the right border, push it to the left
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

    spiderCollision(bee, spider) {
        this.bee.destroyed = true
        this.bee.destroy()
        this.time.delayedCall(1000, () => { this.scene.start('gameOverScene', this.flowerScore) })
    }

    flowerCollision(bee, flower) {
        if(flower.texture.key == 'rosebloom'){
        }
        else{
            //change sprite texture to bloom
            flower.setTexture('rosebloom')

            //this.sound.play('pickup')
            this.pickUpSound.play()

            this.roseHit++
            this.flowerScore++
            this.score.text = this.flowerScore
            this.thisFlower = flower
        }
    }

    flowerTwoCollision(bee, flowerTwo) {
        if(flowerTwo.texture.key == 'violetbloom'){
            //console.log('already flower')
        }
        else{
            //change sprite texture to bloom
            flowerTwo.setTexture('violetbloom')

            //this.sound.play('pickup')
            this.pickUpSound.play()

            this.violetHit++
            this.flowerScore++
            this.score.text = this.flowerScore
            this.thisFlowerTwo = flowerTwo
        }
    }

    flowerThreeCollision(bee, flowerThree) {
        if(flowerThree.texture.key == 'daisybloom'){
            //console.log('already flower')
        }
        else{
            //change sprite texture to bloom
            flowerThree.setTexture('daisybloom')

            //this.sound.play('pickup')
            this.pickUpSound.play()

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