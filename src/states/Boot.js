import Phaser from 'phaser'
import WebFont from 'webfontloader'
import config from '../config'

export default class extends Phaser.State {
	init() {
		this.stage.backgroundColor = config.css.webWhite
		this.fontsReady = false
		this.fontsLoaded = this.fontsLoaded.bind(this)
	}

	preload() {
		WebFont.load({
			custom: {
				families: ['Liip Etica Bd']
			},
			active: this.fontsLoaded
		})

		this.load.image('loaderBg', './assets/images/loader-bg.png')
		this.load.image('loaderBar', './assets/images/preloader.gif')

		this.load.image('player', './assets/images/player.png')
		this.load.image('playerDuck', './assets/images/player_duck.png')
		this.load.image('playerDead', './assets/images/player_dead.png')

		this.load.image('liipLogo', './assets/images/liip_logo.png')
		this.load.image('liipLogoSmall', './assets/images/liip_logo_small.png')

		this.load.image('beer', './assets/images/beer.png')
		this.load.image('award', './assets/images/award.png')
		this.load.image('coffee', './assets/images/coffee.png')

		this.load.tilemap('liip', 'assets/tilemaps/liip.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('gameTiles', 'assets/images/tiles_spritesheet.png')

		this.load.image('replay', 'assets/images/replay.png')

		this.load.audio('coin', 'assets/audio/coin.wav')
		this.load.audio('ouch', 'assets/audio/ouch.wav')
		this.load.audio('jump', 'assets/audio/jump.ogg')
	}

	create() {
		this.scale.pageAlignHorizontally = true
		this.scale.pageAlignVertically = true

		this.game.physics.startSystem(Phaser.Physics.ARCADE)
	}

	render() {
		if (this.fontsReady) {
			this.state.start('Splash')
		}
	}

	fontsLoaded() {
		this.fontsReady = true
	}

}

window.addEventListener('orientationchange', (e) => {
	if (window.orientation == 90 || window.orientation == 0) {
		console.log(screen.orientation.angle)
	}
})
