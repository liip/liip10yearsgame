import Phaser from 'phaser'
import config from '../config'
import { makeGreen } from '../utils'

export default class extends Phaser.State {
	preload() {
		// this.state.start('HighScore')
	}
	create () {
		let intro = this.game.add.sprite(0, 0, 'introScreen')
		intro.width = this.game.width
		intro.height = this.game.height

		// init keys
		this.keys = this.game.input.keyboard.addKeys({
			space: Phaser.KeyCode.SPACEBAR,
		})

		intro.inputEnabled = true
		intro.events.onInputDown.add(() => {
			this.game.state.start('Game')
		})
	}

	update () {
		if (this.keys.space.isDown) {
			this.state.start('Game')
		}
	}
}
