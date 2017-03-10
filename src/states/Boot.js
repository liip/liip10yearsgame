import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
	init() {
		this.stage.backgroundColor = '#fff'
		this.fontsReady = false
		this.fontsLoaded = this.fontsLoaded.bind(this)
	}

	preload() {
		WebFont.load({
			google: {
				families: ['Open Sans']
			},
			active: this.fontsLoaded
		})


		let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', {
			font: '16px Arial',
			fill: '#dddddd',
			align: 'center'
		})
		text.anchor.setTo(0.5, 0.5)

		this.load.image('loaderBg', './assets/images/loader-bg.png')
		this.load.image('loaderBar', './assets/images/preloader.gif')

		this.load.image('player', './assets/images/player.png')
		this.load.image('playerDuck', './assets/images/player_duck.png')
		this.load.image('playerDead', './assets/images/player_dead.png')

		this.load.image('liipLogo', './assets/images/liip_logo.png')

		this.load.image('goldCoin', './assets/images/goldCoin.png')
		this.load.audio('coin', './assets/audio/coin.wav')

		this.load.tilemap('liip', 'assets/tilemaps/liip.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('gameTiles', 'assets/images/tiles_spritesheet.png')

		this.load.audio('ouch', 'assets/audio/ouch.wav')
	}

	create() {
		this.scale.pageAlignHorizontally = true
		this.scale.pageAlignVertically = true
		// this.scale.setScreenSize(true)

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
