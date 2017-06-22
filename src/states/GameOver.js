import Phaser from 'phaser-ce'
import config from '../config'
import Keyboard from '../objects/Keyboard'
import Db from '../objects/Db'

export default class extends Phaser.State {
    init(action, finalScore = 0, highScore = 0) {
        this.jumpInputs = Keyboard.addKeyboard(this.game)
        this.action = action
        this.finalScore = finalScore
        this.highScore = highScore
        this.db = new Db(this.game)
    }

    create() {
        let text = 'Oops.. not enough for TOP 5'
        text += '\nYour Score: ' + this.finalScore + '\nRequired: ' + this.db.minToGetToHighScore()

        // game over text
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
            () =>this.game.state.start('HighScore'),
            this,
            1, 0, 1)
        replay.anchor.set(0.5, 0)
        replay.scale.setTo(0.7)
    }

    update() {
        // Restart game on jump
        if (this.jumpInputs.find(e => e.isDown)) {
            this.state.start('HighScore')
        }
    }
}
