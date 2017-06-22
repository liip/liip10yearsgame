import Phaser from 'phaser-ce'
import config from '../config'
import Keyboard from '../objects/Keyboard'
import Db from '../objects/Db'

export default class extends Phaser.State {
    init(action, finalScore = 300, highScore = 0) {
        this.game.add.plugin(window.PhaserInput.Plugin)

        this.jumpInputs = Keyboard.addKeyboard(this.game)
        this.enterKey = Keyboard.addEnter(this.game)

        this.action = action
        this.finalScore = finalScore
        this.highScore = highScore
        this.db = new Db()
    }

    create() {
        const {inputField: inputFieldCss} = config
        const { width, height } = this.game
        let text = ( this.action === 'gameover' ? 'Oops.. not enough for TOP 5' : 'Congratulations!' ).toUpperCase()
        text += '\nScore: ' + this.finalScore + '\nTop Player: ' + this.highScore

        // gameover text
        let gameOver = this.game.add.text(
            this.game.width / 2,
            this.game.height / 2 - 5,
            text,
            Object.assign(config.text.xl, config.text.center))
        gameOver.anchor.set(0.5, 1)

        const nameInput = this.game.add.inputField(width / 2 - 100, height / 2, config.text.inputField)
        this.nameInput = nameInput
        nameInput.startFocus()
        nameInput.inputEnabled = true
        nameInput.input.useHandCursor = true
    }

    update() {
        // Restart game on jump
        if (this.enterKey.isDown) {
            this.db.addPlayerScore(this.finalScore, this.nameInput.value)
            this.state.start('HighScore')
        }
    }
}
