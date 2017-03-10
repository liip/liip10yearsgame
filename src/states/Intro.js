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

		// setup player
		this.player = this.game.add.sprite(100, 200, 'player')
		this.game.physics.arcade.enable(this.player)
		this.player.body.gravity.y = config.player.weight
		this.game.camera.follow(this.player)

		// current position
		let help = this.game.add.text(
			0, 20,
			'Press the spacebar to start and to jump over obstacles',
			Object.assign(config.text.md, ({ boundsAlignH: "center" })))
		help.setTextBounds(0, 30, config.gameWidth, 30);

		// init keys
		this.keys = this.game.input.keyboard.addKeys({
			space: Phaser.KeyCode.SPACEBAR,
		})

		let playerDuckImg = this.game.cache.getImage('playerDuck')
		this.player.duckedDimensions = {width: playerDuckImg.width, height: playerDuckImg.height}
		this.player.standDimensions = {width: this.player.width, height: this.player.height}
		this.player.anchor.setTo(0.5, 1)
	}

	update () {
		this.game.physics.arcade.collide(this.player, this.blockedLayer, this.playerHit, null, this)
		if (this.keys.space.isDown) {
			this.state.start('Game')
		}
	}
}
