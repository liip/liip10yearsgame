import Phaser from 'phaser'
import WebFont from 'webfontloader'
import config from '../config'

export default class extends Phaser.State {
	init() {
		this.stage.backgroundColor = config.css.webWhite
		this.fontsReady = false
		this.fontsLoaded = this.fontsLoaded.bind(this)
	}

	preload() {
		WebFont.load({
			google: {
				families: ['Ubuntu Mono:700']
			},
			custom: {
				families: ['Liip Etica Bd']
			},
			active: this.fontsLoaded
		})
	}

	create() {
		this.game.scale.pageAlignHorizontally = true
		this.game.scale.pageAlignVertically = true

		if (!this.game.device.desktop) {
			this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
		}

		this.game.physics.startSystem(Phaser.Physics.ARCADE)

		// improve font rendering (Source: https://github.com/photonstorm/phaser/issues/2370)
		this.game.renderer.renderSession.roundPixels = true
	}

	render() {
		if (this.fontsReady) {
			this.state.start('Splash')
		}
	}

	fontsLoaded() {
		this.fontsReady = true
	}

}

window.addEventListener('orientationchange', (e) => {
	if (window.orientation == 90 || window.orientation == 0) {
		console.log(screen.orientation.angle)
	}
})
