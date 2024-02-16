class Menu extends Phaser.Scene{ //Menu class becomes a child of Phaser.Scene
    constructor(){
        super("menuScene")
    }

    preload() {
        this.load.image('beegin', './assets/BeeginTwo.png')
        this.load.audio('music', './assets/beebgmusic.wav')
        this.load.audio('pickup', './assets/itempickup.wav')

    }

    create() {
        this.add.sprite(game.config.width/2, game.config.height/2, 'beegin')

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