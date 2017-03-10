import Phaser from 'phaser'
import { centerGameObjects } from '../utils'
import config from '../config'

export default class extends Phaser.State {
	init () {}

	preload () {
		this.logo = this.game.add.sprite(
			this.game.world.centerX + 20,
			100,
			'liipLogo')
		this.logo.scale.setTo(0.5)
		this.logo.anchor.setTo(0.5)

		let welcome = this.game.add.text(
			0, 100,
			'0% loaded',
			Object.assign(config.text.lg, { boundsAlignH: 'center', boundsAlignV: 'middle' }))
		welcome.setTextBounds(0, 100, config.gameWidth, 100)

	}

	create () {
		this.state.start('Game')
	}

}
