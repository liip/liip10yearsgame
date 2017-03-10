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

		let welcome = this.game.add.text(50, 30, 'Welcome', Object.assign(config.text.lg, { boundsAlignH: "center" }))

		// centerGameObjects([this.loaderBg, this.loaderBar])

		this.load.setPreloadSprite(this.loaderBar)
	}

	create () {
		this.state.start('Game')
	}

}
