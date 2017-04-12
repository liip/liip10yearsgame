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
			custom: {
				families: ['Liip Etica Bd', 'Ubuntu Mono']
			},
			active: this.fontsLoaded
		})
	}

	create() {
		this.game.scale.pageAlignHorizontally = true
		this.game.scale.pageAlignVertically = true

		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL

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
		//  We set a 1 second delay before setting the fontsReady flag.
		//  For some reason if we don't the browser cannot render the text the first time it's created.
		this.game.time.events.add(Phaser.Timer.SECOND, () => {
			this.fontsReady = true
		}, this)
	}

}

window.addEventListener('orientationchange', (e) => {
	if (window.orientation == 90 || window.orientation == 0) {
		/* eslint-disable */
		console.log(screen.orientation.angle)
		/* eslint-enable */
	}
})
