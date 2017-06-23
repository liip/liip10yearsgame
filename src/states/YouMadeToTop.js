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
        let text = 'Yay! You made it to the TOP 5'
        text += '\nYour Score: ' + this.finalScore

        // game over text
        let youMadeItText = game.add.text(width / 2, 100, text, Object.assign(xl, center))
        youMadeItText.anchor.set(0.5, 1)

        let typeYourId = game.add.text(width / 2, 160, 'Player ID Number', makeGreen(Object.assign(lg, center)))
        typeYourId.anchor.set(0.5, 1)
        const nameInput = game.add.inputField(width / 2 - 100, 170, Object.assign(config.text.inputField, {type: window.PhaserInput.InputType.number, max: 999}))
        nameInput.anchor.set(0, 0)

        this.nameInput = nameInput
        nameInput.startFocus()
        nameInput.inputEnabled = true
        nameInput.input.useHandCursor = true
        nameInput.blockInput = false // bubble events up (so that we can catch enterKey press event)
    }

    update() {
        // Show highscore after name is entered
        if (this.enterKey.isDown && this.nameInput.value) {
            this.db.addPlayerScore(this.finalScore, this.nameInput.value)
            this.nameInput.destroy()
            this.state.start('HighScore')
        }
    }
}
