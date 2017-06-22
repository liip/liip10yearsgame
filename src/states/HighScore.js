import Phaser from 'phaser-ce'
import _ from 'lodash'
import config from '../config'
import Keyboard from '../sprites/Keyboard'
import { makeGreen } from '../utils'

export default class extends Phaser.State {
    init() {
        this.stage.backgroundColor = config.css.webWhite
        this.jumpInputs = Keyboard.addKeyboard(this.game)
    }

    loadScore() {
        const todoRemove = JSON.stringify({
            200: '223',
            100: '2312',
            67700: '131 Rdasdas',
            90: 'Levente daas',
            110: 'Leventeas adadsadss'
        })
        this.highScores = JSON.parse(localStorage.getItem('HighScores') || todoRemove)
        // this.highScores = JSON.parse(localStorage.getItem('HighScores') || '{}')
        this.currentScore = 200
        return this.highScores
    }

    saveScore() {
        localStorage.setItem('HighScores', JSON.stringify(this.highScores))
    }

    create() {
        const game = this.game
        const { width, height } = this.game
        const { xl, xxl } = config.text
        const margin = 50
        game.add.text(margin, 50, 'High Scores:', xxl)
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

        let replay = game.add.button(width / 2, height / 2 + 200,
            'start',
            () => game.state.start('Game'),
            this,
            1, 0, 1)
        replay.scale.setTo(0.7)
        replay.anchor.set(0.5, 0)

        _.map(this.loadScore(), (score, winner) => [winner, score])
            .sort((a, b) => b[0] - a[0])
            .map(([score, w], i) => {
                const nr = game.add.text(margin, 200 + i * 40, `${i}.`, makeGreen(xxl))
                const winnerText = game.add.text(margin + 50, 200 + i * 40, `${w}`, xxl)
                const scoreText = game.add.text(margin + 500, 200 + i * 40, `${score}`, xxl)
                winnerText.setShadow(-1, 1, 'rgba(0,0,0,0.1)', 0)
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
