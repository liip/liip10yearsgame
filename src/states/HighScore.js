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
        const margin = 50
        game.add.text(margin, 50, 'Top 5 Scores', xxl)
        const logo = this.game.add.sprite(margin, 100, 'liipLogo')
        logo.scale.setTo(0.62)

        this.playerTimeout = setTimeout(() => {
            this.player = this.game.add.sprite(margin, 100, 'player')
            this.game.add.tween(logo).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true)
        }, 500)

        this.moveTimeout = setTimeout(() => {
            this.game.physics.arcade.enable(this.player)
            this.player.body.velocity.x = config.player.speed * 2
        }, 1000)

        let restart = game.add.button(width / 2, height / 2,
            'start',
            () => game.state.start('Game'),
            this,
            1, 0, 1)
        restart.scale.setTo(0.7)
        restart.anchor.set(0.5, 0)

        const idColumn = game.add.text(margin, 150, 'Player:', makeGreen(xl))
        const ScoreColumn = game.add.text(margin + 200, 150, 'Score:', makeGreen(xl))

        _.map(this.db.loadScore(), (score, winner) => [score, winner])
            .sort((a, b) => b[0] - a[0])
            .splice(0, 5)
            .map(([score, w], i) => {
                const nr = game.add.text(margin, 200 + i * 40, `${i + 1}.`, makeGreen(xxl))
                const winnerText = game.add.text(margin + 50, 200 + i * 40, `${w}`, xxl)
                const scoreText = game.add.text(margin + 200, 200 + i * 40, `${score}`, xxl)
            })
    }

    update() {
        if (this.jumpInputs.find(e => e.isDown)) {
            clearTimeout(this.playerTimeout)
            clearTimeout(this.moveTimeout)
            this.state.start('Intro')
        }
    }

}
