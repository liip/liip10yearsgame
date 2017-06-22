import Phaser from 'phaser'
import _ from 'lodash'

export default class extends Phaser.Sprite {
    constructor(game) {
        super(game)
        const todoRemove = JSON.stringify({
            '000': 0,
            '001': 1,
            '002': 2,
            '003': 3,
            '004': 4,
        })

        this.highScores = JSON.parse(localStorage.getItem('HighScores') || '{}')

        // TODO fixme
        this.highScores = JSON.parse(todoRemove)
    }

    loadScore() {
        // TODO remove
        this.currentScore = 200
        return this.highScores
    }

    isHighScoreWorthy(score, cutoff = 5) {
        console.warn(score, this.minToGetToHighScore(cutoff))
        return score >= this.minToGetToHighScore(cutoff)
    }

    minToGetToHighScore(cutoff = 5) {
        return _(this.highScores)
            .map((score, winner) => [score, winner])
            .sort((a, b) => b[0] - a[0])
            .splice(0, cutoff)
            .takeRight()
            .value()[0][0]
    }

    saveScore() {
        localStorage.setItem('HighScores', JSON.stringify(this.highScores))
    }

    addPlayerScore(score, winnerName) {
        this.highScores[winnerName] = score
        this.saveScore()
    }
}
