import Phaser from 'phaser'
import config from '../config'
import { centerGameObjects } from '../utils'
import Input from '../Input'
import Player from '../sprites/Player'

export default class extends Phaser.State {
	create () {
		// gameover text
		let gameOver = this.game.add.text(
			0,
			100,
			'Gameover'.toUpperCase(),
			Object.assign(config.text.xl, ({ boundsAlignH: "center" })))
		gameOver.setTextBounds(0, 30, this.game.width, 30);

		// init input (keyboard or tap on mobile)
		this.input = new Input({ game: this.game })
	}

	update () {
		// if (this.input.shouldJump()) {
		// 	this.state.start('Game')
		// }
	}
}
