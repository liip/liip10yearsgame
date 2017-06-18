import Phaser from 'phaser-ce'
import config from '../config'
import Keyboard from './../sprites/Keyboard'

export default class extends Phaser.State {
	init() {
        this.jumpInputs = Keyboard.addKeyboard(this.game)
	}

	create () {
		this.map = this.game.add.tilemap('liip')
		this.map.addTilesetImage('tiles_spritesheet', 'gameTiles')

		// create layers
		this.backgroundLayer = this.map.createLayer('backgroundLayer')
		this.blockedLayer = this.map.createLayer('blockedLayer')
		// this.game.world.width may cause problems with collisions, keep in mind
		this.map.setCollisionBetween(1, this.game.world.width, true, 'blockedLayer', true)
		this.backgroundLayer.resizeWorld()

		let banner = this.game.add.image(
			this.game.width / 2,
			120,
			'startLogo')
		banner.anchor.setTo(0.5)
		let bannerRatio = banner.width / banner.height
		banner.width = 700
		if (banner.width > this.game.width ) {
			banner.width = this.game.width - 20
		}
		banner.height = banner.width / bannerRatio

		// start button
		let start = this.game.add.button(
			this.game.width / 2,
			190,
			'start',
			() => { this.game.state.start('Game') },
			this,
			1,
			0,
			1)
		start.anchor.setTo(0.5)
		start.scale.setTo(0.7)

		// setup player
		this.player = this.game.add.sprite(100, 250, 'player')
		this.game.physics.arcade.enable(this.player)
		this.player.body.gravity.y = config.player.weight

		// show hint
		let howToJump = ( this.game.device.desktop ? 'Press space' : 'Tap your screen' )
		let intro = this.game.add.text(
			this.game.width / 2,
			260,
			`${howToJump} to jump`.toUpperCase(),
			Object.assign(config.text.lg, config.text.center))
		intro.anchor.setTo(0.5, 0)

		this.player.standDimensions = {width: this.player.width, height: this.player.height}
		this.player.anchor.setTo(0.5, 1)
	}

	update () {
		this.game.physics.arcade.collide(this.player, this.blockedLayer, null, null, this)

		// Start game on jump
		if (this.jumpInputs.find(e => e.isDown)) {
			this.state.start('Game')
		}
	}
}
