import Phaser from 'phaser'
import axios from 'axios'
import _ from 'lodash'
import config from '../config'
import {centerGameObjects} from '../utils'

export default class extends Phaser.State {
	init() {
		this.stage.backgroundColor = config.css.webWhite
	}

	preload() {
	}

	create() {
		const margin = 50
		this.game.add.text(margin, 50, 'High Scores:', config.text.xl)
		const logo = this.game.add.sprite(margin, 100, 'liipLogo')
		logo.scale.setTo(0.62)

		setTimeout(() => {
			this.player = this.game.add.sprite(margin * 2, 100, 'player')
			this.game.add.tween(logo).to({alpha: 0}, 300, Phaser.Easing.Linear.None, true)
		}, 500)

		setTimeout(() => {
			this.game.physics.arcade.enable(this.player)
			this.player.body.velocity.x = config.player.speed * 2
		}, 1000)

		const replay = this.game.add.sprite(this.game.width / 2, this.game.height - margin - 10, 'replay')
		replay.inputEnabled = true
		replay.events.onInputDown.add(() => {
			// logo.alpha = 0
			this.game.state.start('Game')
		})
		replay.scale.setTo(0.61)
		replay.anchor.setTo(0.5)

		// init keys
		this.keys = this.game.input.keyboard.addKeys({
			space: Phaser.KeyCode.SPACEBAR,
		})

		axios.get(config.backendDomain + '/scores')
			.then(({data}) => data)
			.then(winners => _(winners)
				.map((score, winner) => [score, winner])
				.sort((a, b) => b[0] - a[0])
				.value())
			.then(winners => {
				winners.map(([score, w], i) => {
					const text = this.game.add.text(margin, 200 + i * 40, `Person:\t${w}\tScore:\t${score}`, config.text.lg)
					text.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 0)
				})
			})
			.catch(console.warn)
	}

	update() {
		if (this.keys.space.isDown) {
			this.state.start('Game')
		}
	}

}
