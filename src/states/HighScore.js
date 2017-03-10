import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
	init() {
		console.warn('HighScore Loaded')
		this.stage.backgroundColor = '#fff'
	}

	preload() {
		console.warn('loaded')

		// this.load.image('liipLogo', './assets/images/liip_logo.png')

		// this.load.image('loaderBar', './assets/images/loader-bar.png')
		// this.game.add.sprite(1000, 1000, 'liipLogo')
	}

	create() {
		console.warn('loaded')
	}

	render() {
		console.warn('loaded')
	}


}
