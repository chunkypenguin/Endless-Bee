class Menu extends Phaser.Scene{ //Menu class becomes a child of Phaser.Scene
    constructor(){
        super("menuScene")
    }

    preload() {
        this.load.image('beegin', './assets/BeeginTwo.png')
        this.load.audio('music', './assets/beebgmusic.wav')
        this.load.audio('pickup', './assets/itempickup.wav')

        this.load.path = './assets/'
        this.load.image('greenbg', 'GreenBG.png')
        this.load.image('rosebud', 'LargeRoseBud.png')
        this.load.image('rosebloom', 'LargeRoseBloom.png')
        this.load.image('violetbud', 'VioletBudLarge.png')
        this.load.image('violetbloom', 'VioletBloomLarge.png')
        this.load.image('daisybud', 'DaisyBudLarge.png')
        this.load.image('daisybloom', 'DaisyBloomLarge.png')
        this.load.image('spider', 'Spider.png')
        this.load.image('gameover', 'GameOver.png')

                // load spritesheet
                this.load.spritesheet('beefly', 'beee.png', {
                    frameWidth: 64,
                    frameHeight: 64,
                    startFrame: 0,
                    endFrame: 6
                })
    }

    create() {
        this.add.sprite(game.config.width/2, game.config.height/2, 'beegin').setScale(1.5)

        this.bgMusic = this.sound.add('music', {volume: 0.5, loop: true})

        if(!this.musicPlayed){
            this.bgMusic.play()
            this.musicPlayed = true
        }

        if (this.musicPlayed && this.scene.isActive('playScene')){
            this.musicPlayed = false
        }

        keyRIGHT = 
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)){
            this.sound.play('pickup')
            this.scene.start('playScene')
        }
    }
}