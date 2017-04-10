import Phaser from 'phaser'
import config from '../config'
import { centerGameObjects, isTouchDevice } from '../utils'

export default class extends Phaser.State {
	init() {
		if(this.game.device.desktop) {
			this.jumpInput = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
		} else {
			this.jumpInput = this.game.input.pointer1
		}
	}

	create () {
		this.map = this.game.add.tilemap('liip')
		this.map.addTilesetImage('tiles_spritesheet', 'gameTiles')

		// create layers
		this.backgroundLayer = this.map.createLayer('backgroundLayer')
		this.blockedLayer = this.map.createLayer('blockedLayer')
		this.map.setCollisionBetween(1, 100000, true, 'blockedLayer')
		this.backgroundLayer.resizeWorld()

		let banner = this.game.add.image(
			this.game.width / 2,
			100,
			'startLogo')
		banner.scale.setTo(0.35)

		// start button
		let start = this.game.add.button(
			this.game.width / 2,
			180,
			'start',
			() => { this.game.state.start('Game') },
			this,
			1,
			0,
			1)
		start.scale.setTo(0.7)
		centerGameObjects([banner, start])

		// setup player
		this.player = this.game.add.sprite(100, 250, 'player')
		this.game.physics.arcade.enable(this.player)
		this.player.body.gravity.y = config.player.weight

		// show hint
		let howToJump = isTouchDevice()
			? 'Tap your screen'
			: 'Press space'
		let intro = this.game.add.text(
			0,
			230,
			`${howToJump} to jump`.toUpperCase(),
			Object.assign(config.text.lg, ({ boundsAlignH: 'center' })))
		intro.setTextBounds(0, 30, this.game.width, 30)

		this.player.standDimensions = {width: this.player.width, height: this.player.height}
		this.player.anchor.setTo(0.5, 1)
	}

	update () {
		this.game.physics.arcade.collide(this.player, this.blockedLayer, null, null, this)

		// Start game on jump
		if (this.jumpInput.isDown) {
			this.state.start('Game')
		}
	}
}
