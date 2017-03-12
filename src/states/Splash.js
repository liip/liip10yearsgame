import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.State {
	init () {}

	preload () {
		let loading = this.game.add.text(
			0, 40,
			'loading',
			Object.assign(config.text.lg, { boundsAlignH: 'center', boundsAlignV: 'middle' }))
		loading.setTextBounds(0, 100, config.gameWidth, 100)

	}

	create () {
		this.state.start('Intro')
	}

}
