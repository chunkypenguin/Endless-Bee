class Menu extends Phaser.Scene{ //Menu class becomes a child of Phaser.Scene
    constructor(){
        super("menuScene")
    }

    preload() {
        this.load.image('beegin', './assets/Beegin.png')

        this.load.audio('music', './assets/beebgmusic.mp3')

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
    }
}