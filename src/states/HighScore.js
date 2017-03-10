import Phaser from 'phaser'
import axios from 'axios'
import _ from 'lodash'
import config from '../config'

export default class extends Phaser.State {
	init() {
		this.stage.backgroundColor = config.css.webWhite
	}

	preload() {
	}

	create() {
		console.log('started')
		const leftMargin = 50
		this.game.add.text(leftMargin, 50, 'High Scores:', config.text.xl)
		const logo = this.game.add.sprite(leftMargin, 100, 'liipLogo')
		logo.scale.setTo(0.62)

		setTimeout(() => {
			this.player = this.game.add.sprite(leftMargin * 2, 100, 'player')
			this.game.add.tween(logo).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true)
		}, 500)

		setTimeout(() => {
			this.game.physics.arcade.enable(this.player)
			this.player.body.velocity.x = config.player.speed * 2
		}, 1000)

		const replay = this.game.add.sprite(leftMargin, 300, 'replay')
		replay.inputEnabled = true
		replay.events.onInputDown.add(() => {
			this.game.state.start('Game')
		})

		axios.get(config.backendDomain + '/scores')
			.then(({data}) => data)
			.then(winners => _(winners)
				.map((score, winner) => [score, winner])
				// .sort((a, b) => b[0] - a[0])
				.value())
			.then(winners => {
				winners.map(([score, w], i) => {
					const text = this.game.add.text(leftMargin, 200 + i * 40, `Person:\t${w}\tScore:\t${1111}`, config.text.lg)
					text.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 0)
				})
			})
			.catch(console.warn)
	}

	render() {
	}

}
