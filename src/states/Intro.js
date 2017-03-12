import Phaser from 'phaser'
import config from '../config'
import { makeGreen } from '../utils'

export default class extends Phaser.State {
	create () {
		this.map = this.game.add.tilemap('liip')
		this.map.addTilesetImage('tiles_spritesheet', 'gameTiles')

		// create layers
		this.backgroundLayer = this.map.createLayer('backgroundLayer')
		this.blockedLayer = this.map.createLayer('blockedLayer')
		this.map.setCollisionBetween(1, 100000, true, 'blockedLayer')
		this.backgroundLayer.resizeWorld()

		let banner = this.game.add.sprite(
			200,
			20,
			'startLogo')
		banner.scale.setTo(0.25)

		// start button
		let start = this.game.add.sprite(
			350,
			100,
			'start')
		start.scale.setTo(0.9)

		// setup player
		this.player = this.game.add.sprite(100, 200, 'player')
		this.game.physics.arcade.enable(this.player)
		this.player.body.gravity.y = config.player.weight
		this.game.camera.follow(this.player)

		// show hint
		let intro = this.game.add.text(
			20,
			170,
			'Press space to jump',
			Object.assign(config.text.md, ({ boundsAlignH: "center" })))
		intro.setTextBounds(0, 30, config.gameWidth, 30);

		// init keys
		this.keys = this.game.input.keyboard.addKeys({
			space: Phaser.KeyCode.SPACEBAR,
		})

		this.player.standDimensions = {width: this.player.width, height: this.player.height}
		this.player.anchor.setTo(0.5, 1)
		start.inputEnabled = true
		start.events.onInputDown.add(() => {
			this.game.state.start('Game')
		})
	}

	update () {
		this.game.physics.arcade.collide(this.player, this.blockedLayer, this.playerHit, null, this)
		if (this.keys.space.isDown) {
			this.state.start('Game')
		}
	}
}
