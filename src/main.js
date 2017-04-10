import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import IntroState from './states/Intro'
import GameState from './states/Game'
import GameOver from './states/GameOver'
import HighScore from './states/HighScore'

import config from './config'

import './extensions'

class Game extends Phaser.Game {
	constructor() {
		const docElement = document.documentElement
		const width = docElement.clientWidth
		const height = docElement.clientHeight
		let sizeFactor = 1

		if ( height < config.minHeight ) {
			sizeFactor = config.minHeight / height
		}

		super(width * sizeFactor, height * sizeFactor, Phaser.CANVAS, 'content', null)

		this.state.add('Boot', BootState, false)
		this.state.add('Splash', SplashState, false)
		this.state.add('Intro', IntroState, false)
		this.state.add('Game', GameState, false)
		this.state.add('GameOver', GameOver, false)
		this.state.add('HighScore', HighScore, false)

		this.state.start('Boot')
	}
}

window.game = new Game()
