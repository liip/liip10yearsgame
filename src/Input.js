import Phaser from 'phaser'

/**
 * Class for handling input interaction with keyboard and touch devices
 */
export default class {
	constructor({ game }) {
		this.jump = false
		this.game = game

		// add handling for spacebar
		let space = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR)
		space.onDown.add(() => {
			this.jump = true
		})

		// add handling for tapping
		this.game.input.onDown.add(() => {
			this.jump = true
		})

	}

	/**
	 * Should we jump?
	 * Crappy handling for supporting both tapping and spacebar
	 * @return {Boolean}
	 */
	shouldJump() {
		// remember value
		let jump = this.jump
		// reset it to false
		this.jump = false
		// return original value
		return jump
	}
}
