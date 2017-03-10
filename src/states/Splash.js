import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.State {
	init () {}

	preload () {
		let logo = this.game.add.sprite(
			this.game.world.centerX + 20,
			100,
			'startLogo')
		logo.scale.setTo(0.3)
		logo.anchor.setTo(0.5)

		let welcome = this.game.add.text(
			0, 40,
			'loading',
			Object.assign(config.text.lg, { boundsAlignH: 'center', boundsAlignV: 'middle' }))
		welcome.setTextBounds(0, 100, config.gameWidth, 100)

	}

	create () {
		this.state.start('Intro')
	}

}
