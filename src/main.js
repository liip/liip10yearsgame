import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import IntroState from './states/Intro'
import GameState from './states/Game'
import GameOver from './states/GameOver'
import HighScore from './states/HighScore'
import YouMadeToTop from './states/YouMadeToTop'

import config from './config'

import './extensions'

class Game extends Phaser.Game {
	constructor() {
		super(config.gameWidth * config.sizeFactor, config.gameHeight * config.sizeFactor, Phaser.CANVAS, 'content', null)

		this.state.add('Boot', BootState, true)
		this.state.add('Splash', SplashState, false)
		this.state.add('Intro', IntroState, false)
		this.state.add('Game', GameState, false)
		this.state.add('GameOver', GameOver, false)
		this.state.add('HighScore', HighScore, false)
		this.state.add('YouMadeToTop', YouMadeToTop, false)
	}
}

window.game = new Game()
