import Phaser from 'phaser'
import axios from 'axios'
import _ from 'lodash'
import WebFont from 'webfontloader'
import config from '../config'
import {centerGameObjects} from '../utils'

export default class extends Phaser.State {
	init() {
		this.stage.backgroundColor = '#fff'
		this.highScores = null
	}

	preload() {
		this.load.image('liipLogo', './assets/images/liip_logo.png')
	}

	create() {
		axios.get(config.backendDomain + '/scores')
			.then(({data}) => data)
			.then(winners => _(winners)
				.map((score, winner) => [score, winner])
				.sort((a, b) => b[0] - a[0]).value())
			.then(winners => {
				this.highScores = this.game.add.text(300, 300, `score: ${winners}`, config.hud)
			})
			.catch(console.warn)

		const winners = ['Levente 10000', 'Rita 1000'].join(' | ')
		const logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY - 100, 'liipLogo')
		const player = this.game.add.sprite(this.game.world.centerX - 300, this.game.world.centerY, 'player')
		centerGameObjects([logo, player])
		this.game.add.text(300, 300, 'High Scores:', config.text.md)
	}

	render() {
	}


}
