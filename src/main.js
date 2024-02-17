// Name: Alex Beteta
// Game Title: Bee Blossom 
// Hours Spent: 24
// Creative Tilt: I'm proud that I was able to not have the flowers spawn over each other,
//  it took awhile to figure it out but I think it was worth it! I also just emjoy the theme of the game!
'use strict'

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true
        }
    },
    scene: [ Menu, Play, GameOver ]
}

let game = new Phaser.Game(config)

// define globals
let centerX = game.config.width/2
let centerY = game.config.height/2
let w = game.config.width
let h = game.config.height

//let { width, height } = game.config

let cursors

let keyRIGHT
let keyMENU
let keyRestart