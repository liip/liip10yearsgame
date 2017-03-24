import Phaser from 'phaser'

/**
 * Class for handling input interaction with keyboard and touch devices
 */
export default class {
	constructor({ game, muteBtn }) {
		this.jump = false
		this.game = game
		this.muteBtn = muteBtn

		if(this.game.device.desktop) {
			// add handling for spacebar
			let space = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR)
			space.onDown.add(() => {
				this.jump = true
			})
		} else {
			// add handling for tapping
			this.game.input.onDown.add((e) => {
				// don't jump when muteBtn is clicked
				if(this.muteBtn && e.x < this.muteBtn.x + this.muteBtn.width + 10 && e.y > this.muteBtn.y - muteBtn.height) {
					// muteBtn pressed
				} else {
					this.jump = true
				}
			})
		}
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
