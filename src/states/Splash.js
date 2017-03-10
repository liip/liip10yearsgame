import Phaser from 'phaser'
import { centerGameObjects } from '../utils'
import config from '../config'

export default class extends Phaser.State {
	init () {}

	preload () {
		this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
		this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')

		this.logo = this.game.add.sprite(300, 50, 'liipLogo')
		this.logo.scale.setTo(0.5)

		let welcome = this.game.add.text(50, 30, 'Welcome', {
			font: '26px Liip Etica Bd',
			fill: config.css.liipGreen
		})

		centerGameObjects([this.logo, this.loaderBg, this.loaderBar])

		this.load.setPreloadSprite(this.loaderBar)
	}

	create () {
		// this.state.start('Game')
	}

}
