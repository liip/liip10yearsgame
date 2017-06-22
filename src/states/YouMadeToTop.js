import Phaser from 'phaser-ce'
import config from '../config'
import Keyboard from '../objects/Keyboard'

export default class extends Phaser.State {
    init(action, finalScore = 0, highScore = 0) {
        this.game.add.plugin(window.PhaserInput.Plugin)

        this.jumpInputs = Keyboard.addKeyboard(this.game)
        this.enterKey = Keyboard.addEnter(this.game)

        this.action = action
        this.finalScore = finalScore
        this.highScore = highScore
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

        // replay button
        let replay = this.game.add.button(
            this.game.width / 2,
            this.game.height / 2 + 5,
            'replay',
            () => this.game.state.start('Game'),
            this,
            1, 0, 1)

        replay.anchor.set(0.5, 0)
        replay.scale.setTo(0.7)

        const nameInput = this.game.add.inputField(width / 2, height / 2, config.text.inputField)
        this.nameInput = nameInput
        nameInput.startFocus()
        nameInput.inputEnabled = true
        nameInput.input.useHandCursor = true

        nameInput.events.onInputDown.add((e) => {
            console.log('done', e.value)
        })
        nameInput.events.onInputUp.add((e) => {
            console.log('up', e)
        })
    }

    update() {
        // Restart game on jump
        if (this.jumpInputs.find(e => e.isDown)) {
            this.state.start('HighScore')
        }
        if (this.enterKey.isDown) {
            console.warn(this.nameInput.value)
        }
    }
}
