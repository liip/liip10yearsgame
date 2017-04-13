import Phaser from 'phaser'
import config from '../config'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
	init(action, finalScore, highScore) {
		if(this.game.device.desktop) {
			this.jumpInput = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
		} else {
			this.jumpInput = this.game.input.pointer1
		}
		this.action = action
		this.finalScore = finalScore
		this.highScore = highScore
	}

	create () {
		let text = ( this.action === 'gameover' ? 'Game Over' : 'Congratulations!' ).toUpperCase()
		text += '\nScore: ' + this.finalScore + '\nPersonal Best: ' + this.highScore
		// gameover text
		let gameOver = this.game.add.text(
			this.game.width / 2,
			50,
			text,
			Object.assign(config.text.xl, ({ boundsAlignH: 'center' })))
		gameOver.anchor.set(0.5, 0)

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
	}

	update () {
		// Restart game on jump
		if (this.jumpInput.isDown) {
			this.state.start('Game')
		}
	}
}
