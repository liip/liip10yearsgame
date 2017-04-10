import Phaser from 'phaser'
import config from '../config'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
	init() {
		if(this.game.device.desktop) {
			this.jumpInput = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
		} else {
			this.jumpInput = this.game.input.pointer1
		}
	}

	create () {
		// gameover text
		let gameOver = this.game.add.text(
			0,
			100,
			'Game Over'.toUpperCase(),
			Object.assign(config.text.xl, ({ boundsAlignH: 'center' })))
		gameOver.setTextBounds(0, 30, this.game.width, 30)

		// replay button
		let replay = this.game.add.button(
			this.game.width / 2,
			250,
			'replay',
			() => { this.game.state.start('Game') },
			this,
			1, 0, 1)
		replay.scale.setTo(0.7)
		centerGameObjects([replay])

		// @todo add final score?
	}

	update () {
		// Restart game on jump
		if (this.jumpInput.isDown) {
			this.state.start('Game')
		}
	}
}
