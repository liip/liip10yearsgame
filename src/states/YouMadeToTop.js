import Phaser from 'phaser-ce'
import config from '../config'
import Keyboard from '../objects/Keyboard'
import { makeGreen } from '../utils'
import Db from '../objects/Db'

export default class extends Phaser.State {
    init(action, finalScore = 300, highScore = 0) {
        this.game.add.plugin(window.PhaserInput.Plugin)

        this.jumpInputs = Keyboard.addKeyboard(this.game)
        this.enterKey = Keyboard.addEnter(this.game)

        this.action = action
        this.finalScore = finalScore
        this.highScore = highScore
        this.db = new Db(this.game)
    }

    create() {
        const game = this.game
        const { width, height } = game
        const { lg, xl, center } = config.text
        let text = 'Congratulations!'.toUpperCase()
        text += '\nYour Score: ' + this.finalScore + '\nRequired: ' + this.db.minToGetToHighScore()

        // game over text
        let gameOver = game.add.text(width / 2, height / 2 - 50, text, Object.assign(xl, center))
        gameOver.anchor.set(0.5, 1)

        const nameInput = game.add.inputField(width / 2 - 100, height / 2, config.text.inputField)
        let typeYourId = game.add.text(width / 2 - 80, height / 2 - 40, 'Player ID Number', makeGreen(Object.assign(lg, center)))

        this.nameInput = nameInput
        nameInput.startFocus()
        nameInput.inputEnabled = true
        nameInput.input.useHandCursor = true
    }

    update() {
        // Restart game on jump
        if (this.enterKey.isDown && this.nameInput.value) {
            this.db.addPlayerScore(this.finalScore, this.nameInput.value)
            this.nameInput.destroy()
            this.state.start('HighScore')
        }
    }
}
