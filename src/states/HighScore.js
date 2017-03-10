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
		this.load.image('liipLogo', './assets/images/liip_logo.png')
	}

	create() {
		this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 100, 'liipLogo')

		const player = this.game.add.sprite(this.game.world.centerX - 300, this.game.world.centerY, 'player')
		this.game.physics.arcade.enable(player)
		this.game.add.text(100, 100, 'High Scores:', config.text.xl)

		// centerGameObjects([logo, player])
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
