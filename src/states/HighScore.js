import Phaser from 'phaser'
import axios from 'axios'
import _ from 'lodash'
import WebFont from 'webfontloader'
import config from '../config'
import {centerGameObjects} from '../utils'

export default class extends Phaser.State {
	init() {
		this.stage.backgroundColor = '#fff'
	}

	preload() {
	}

	create() {
		const logo = this.game.add.sprite(100, 200, 'liipLogo')
		logo.scale.setTo(0.5)

		const player = this.game.add.sprite(150, 200, 'player')
		this.game.physics.arcade.enable(player)
		this.game.add.text(100, 100, 'High Scores:', config.text.xl)

		setTimeout(() => {
			player.body.velocity.x = config.player.speed * 2
		}, 500)

		axios.get(config.backendDomain + '/scores')
			.then(({data}) => data)
			.then(winners => _(winners)
				.map((score, winner) => [score, winner])
				.sort((a, b) => b[0] - a[0]).value())
			.then(winners => {
				winners.map(([score, w], i) => {
					const text = this.game.add.text(100, 300 + i * 40, `Person:\t${w}\tScore:\t${score}`, config.text.xl)
					text.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 0)
				})
			})
			.catch(console.warn)
	}

	render() {
	}

}
