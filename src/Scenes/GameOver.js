class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene')
    }


    create (score) {
        this.add.sprite(game.config.width/2, game.config.height/2, 'gameover').setScale(1.75)

        this.myscore = score

        console.log(this.myscore)
        keyMENU = 
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M)
        keyRestart = 
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)

        //this.score = this.add.text(centerX, centerY, this.myscore, {depth: 2})

        //console.log(score)
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyMENU)){
            this.sound.play('pickup')
            this.scene.start('menuScene')
        }

        else if(Phaser.Input.Keyboard.JustDown(keyRestart)){
            this.sound.play('pickup')
            this.scene.start('playScene')
        }
    }
}