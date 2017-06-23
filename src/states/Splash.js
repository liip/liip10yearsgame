import Phaser from 'phaser-ce'
import config from '../config'

export default class extends Phaser.State {
    init() {
    }

    preload() {
        let loading = this.game.add.text(
            0, 0,
            'loading'.toUpperCase(),
            Object.assign(config.text.xl, { boundsAlignH: 'center', boundsAlignV: 'middle' }))
        loading.setTextBounds(0, 100, this.game.width, 100)

        this.load.image('liipLogo', './assets/images/liip_logo.png')
        this.load.image('startLogo', './assets/images/start_logo.png')
        this.load.image('liipLogoSmall', './assets/images/liip_logo_small.png')

        this.load.image('beer', './assets/images/beer.png')
        this.load.image('award', './assets/images/award.png')
        this.load.image('coffee', './assets/images/coffee.png')
        this.load.image('office', './assets/images/office.png')
        this.load.image('people', './assets/images/people.png')

        this.load.tilemap('liip', './assets/tilemaps/liip.json', null, Phaser.Tilemap.TILED_JSON)
        this.load.image('gameTiles', './assets/images/tiles_spritesheet.png')

        this.load.spritesheet('replay', './assets/images/replay.png', 140, 140)
        this.load.spritesheet('start', './assets/images/start.png', 140, 140)
        this.load.spritesheet('mute', './assets/images/mute.png', 40, 40)

        this.load.spritesheet('player', './assets/images/hero-normal.png', 90, 70, 9)
        this.load.spritesheet('playerDead', './assets/images/hero-dead.png', 90, 70, 9)
        this.load.spritesheet('playerJump', './assets/images/hero-jump3.png', 90, 70, 8)

        this.load.audio('coin', './assets/audio/coin.wav')
        this.load.audio('ouch', './assets/audio/ouch.wav')
        this.load.audio('jump', './assets/audio/jump.wav')

    }

    create() {
        this.state.start('Intro')
    }

}
