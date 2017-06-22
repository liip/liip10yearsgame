import Phaser from 'phaser'
import _ from 'lodash'

export default class extends Phaser.Sprite {
    constructor(game) {
        super(game)
        const initialScores = JSON.stringify({
            '000': 0,
            '001': 1,
            '002': 2,
            '003': 3,
            '004': 4,
        })

        this.highScores = JSON.parse(localStorage.getItem('HighScores') || initialScores)
    }

    loadScore() {
        return JSON.parse(localStorage.getItem('HighScores') || '{}')
    }

    isHighScoreWorthy(score, cutoff = 5) {
        return score >= this.minToGetToHighScore(cutoff)
    }

    minToGetToHighScore(cutoff = 5) {
        return _(this.loadScore())
            .map((score, winner) => [score, winner])
            .sort((a, b) => b[0] - a[0])
            .splice(0, cutoff)
            .takeRight()
            .value()[0][0]
    }

    saveScore(highscores) {
        localStorage.setItem('HighScores', JSON.stringify(highscores))
    }

    addPlayerScore(score, winnerName) {
        const highScores = this.loadScore()
        highScores[winnerName] = score
        this.saveScore(highScores)
    }
}
