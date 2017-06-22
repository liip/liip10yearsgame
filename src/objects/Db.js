import Phaser from 'phaser'
import config from '../config'
import _ from 'lodash'

export default class extends Phaser.Sprite {
	constructor(game) {
		super(game)
        const todoRemove = JSON.stringify({
            '123': 444444200,
            '456': 4444444440,
            '666': 4444444440,
            '667': 44440,
            '117': 4444440,
        })

        this.highScores = JSON.parse(localStorage.getItem('HighScores') || todoRemove)

        // TODO fixme
        this.highScores = JSON.parse( todoRemove)
	}

    loadScore() {
        this.currentScore = 200
        return this.highScores
    }

    isHighScoreWorthy(score) {
	    const top5 = _(this.highScore)
            .map((score, winner) => [score, winner])
            .sort((a, b) => b[0] - a[0])
            .splice(5, 5)
            // .last()
            .value()
        console.warn(top5)
        return score > top5

    }

    saveScore() {
        localStorage.setItem('HighScores', JSON.stringify(this.highScores))
    }

    addPlayerScore(score, winnerName) {
        this.highScores[winnerName] = score
        this.saveScore()
    }
}
