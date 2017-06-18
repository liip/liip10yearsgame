import Phaser from 'phaser-ce'
import config from '../config'

export default class extends Phaser.State {
    init(action, finalScore = 0, highScore = 0) {
        if (this.game.device.desktop) {
            this.jumpInput = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
            this.jumpInput = this.game.input.keyboard.addKey(Phaser.Keyboard.UP)
        } else {
            this.jumpInput = this.game.input.pointer1
        }
        this.action = action
        this.finalScore = finalScore
        this.highScore = highScore
    }

    create() {
        let text = ( this.action === 'gameover' ? 'Game Over' : 'Congratulations!' ).toUpperCase()
        text += '\nScore: ' + this.finalScore + '\nPersonal Best: ' + this.highScore
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
            () => {
                this.game.state.start('Game')
            },
            this,
            1, 0, 1)
        replay.anchor.set(0.5, 0)
        replay.scale.setTo(0.7)
    }

    update() {
        // Restart game on jump
        if (this.jumpInput.isDown) {
            this.state.start('Game')
        }
    }
}
