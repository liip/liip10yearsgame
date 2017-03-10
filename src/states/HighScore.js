import Phaser from 'phaser'
import WebFont from 'webfontloader'
import config from '../config'

export default class extends Phaser.State {
	init() {
		this.stage.backgroundColor = '#fff'
		this.highScores = null
	}

	preload() {
		this.load.image('liipLogo', './assets/images/liip_logo.png')
	}

	create() {
		const winners = ['Levente 10000', 'Rita 1000'].join(' | ')
		this.game.add.sprite(0, 0, 'liipLogo')
		this.game.add.sprite(100, 200, 'player')
		this.highScores = this.game.add.text(300, 300, `score: ${winners}`, config.hud)
	}

	render() {
	}


}
