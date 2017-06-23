import Phaser from 'phaser-ce'
import _ from 'lodash'
import config from '../config'
import Keyboard from '../objects/Keyboard'
import { makeGreen } from '../utils'
import Db from '../objects/Db'

export default class extends Phaser.State {
    init() {
        this.stage.backgroundColor = config.css.webWhite
        this.jumpInputs = Keyboard.addKeyboard(this.game)
        this.db = new Db(game)
    }

    create() {
        const game = this.game
        const { width, height } = this.game
        const { xl, xxl } = config.text

        const logo = game.add.sprite(width / 2 - 110, 70, 'liipLogo')
        logo.scale.setTo(0.3)
        logo.anchor.set(0, 1)
        const title = game.add.text(width / 2 + 110, 80, 'TOP 5', xxl)
        title.anchor.set(1, 1)

        const idColumn = game.add.text(width / 2 - 100, 120, 'Player:', makeGreen(xl))
        idColumn.anchor.set(0.5, 1)
        const ScoreColumn = game.add.text(width / 2 + 100, 120, 'Score:', makeGreen(xl))
        ScoreColumn.anchor.set(0.5, 1)

        _.map(this.db.loadScore(), (score, winner) => [score, winner])
            .sort((a, b) => b[0] - a[0])
            .splice(0, 5)
            .map(([score, w], i) => {
                const nr = game.add.text(width / 2 - 130, 160 + i * 40, `${i + 1}.`, makeGreen(xl))
                nr.anchor.set(0.5, 1)
                const winnerText = game.add.text(width / 2 - 80, 160 + i * 40, `${w}`, xl)
                winnerText.anchor.set(0.5, 1)
                const scoreText = game.add.text(width / 2 + 100, 160 + i * 40, `${score}`, xl)
                scoreText.anchor.set(0.5, 1)
            })

        let restart = game.add.button(width / 2, 410,
            'start',
            () => game.state.start('Game'),
            this,
            1, 0, 1)
        restart.scale.setTo(0.6)
        restart.anchor.set(0.5, 1)
    }

    update() {
        if (this.jumpInputs.find(e => e.isDown)) {
            this.state.start('Intro')
        }
    }

}
