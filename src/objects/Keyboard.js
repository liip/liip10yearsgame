import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Keyboard {
    static addKeyboard(game) {
        return game.device.desktop
            ? [
                game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
                game.input.keyboard.addKey(Phaser.Keyboard.UP)
            ]
            : [game.input.pointer1]
    }

    static addEnter(game) {
        return game.device.desktop
            ? game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
            : game.input.pointer1
    }
}
