import Phaser from 'phaser'
import config from '../config'
import { centerGameObjects } from '../utils'
import Input from '../Input'

export default class extends Phaser.State {
	create () {
		// gameover text
		let gameOver = this.game.add.text(
			0,
			100,
			'Gameover'.toUpperCase(),
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

		// init input (keyboard or tap on mobile)
		this.input = new Input({ game: this.game })

		// @todo add final score?
	}

	update () {
		// Restart game on jump
		if (this.input.shouldJump()) {
			this.state.start('Game')
		}
	}
}
