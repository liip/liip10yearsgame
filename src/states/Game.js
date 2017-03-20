/* globals __DEV__ */
import Phaser from 'phaser'
import config from '../config'
import {makeGreen,findObjectsByType,createFromTiledObject} from '../utils'
import _ from 'lodash'
import Player from '../sprites/Player'

export default class extends Phaser.State {
	init() {
		this.years = 11
		this.startYear = 2007
	}

	preload() {
	}

	create() {
		this.map = this.game.add.tilemap('liip')
		this.map.addTilesetImage('tiles_spritesheet', 'gameTiles')
		this.mapWidthInPixels = this.map.widthInPixels

		// create layers
		this.backgroundLayer = this.map.createLayer('backgroundLayer')
		this.blockedLayer = this.map.createLayer('blockedLayer')
		this.map.setCollisionBetween(1, 200000, true, 'blockedLayer', true)
		this.backgroundLayer.resizeWorld()

		this.logo = this.game.add.sprite(20, 35, 'liipLogoSmall')
		this.logo.scale.setTo(0.5)
		this.logo.fixedToCamera = true

		// setup player
		this.player = new Player({
			game: this.game,
			x: 0,
			y: 250,
			asset: 'player'
		})
		this.player.enable()

		// score
		this.scoreLabel = this.game.add.text(config.gameWidth - 70, 30, '0', makeGreen(config.text.xl))
		this.scoreLabel.fixedToCamera = true

		// current position
		this.positionLabel = this.game.add.text(0, 0, '2007', Object.assign(config.text.xl, ({boundsAlignH: "center"})))
		this.positionLabel.setTextBounds(0, 30, config.gameWidth, 30)
		this.positionLabel.fixedToCamera = true

		// init keys
		this.keys = this.game.input.keyboard.addKeys({
			space: Phaser.KeyCode.SPACEBAR,
			down: Phaser.KeyCode.DOWN
		})

		// load sounds
		this.soundCoin = this.game.add.audio('coin')
		this.soundOuch = this.game.add.audio('ouch')

		// add objects
		this.createBeers()
		this.createAwards()
		this.createCoffees()
	}

	update() {
		this.game.physics.arcade.collide(this.player, this.blockedLayer, this.playerHit, null, this)

		if (this.player.alive) {
			if (this.keys.space.isDown) {
				this.player.jump()
			} else if (this.keys.down.isDown) {
				this.player.duck()
			}

			this.updateScore(5)

			if (!this.keys.down.isDown && this.player.isDucked) {
				this.player.stopDucking()
			}

			// Update position label depending on the position of the player
			this.positionLabel.text = this.getCurrentYear(this.player.x)
		}

		// make obejects collectable
		this.game.physics.arcade.overlap(this.player, this.beers, this.collect, null, this);
		this.game.physics.arcade.overlap(this.player, this.awards, this.collect, null, this);
		this.game.physics.arcade.overlap(this.player, this.coffees, this.collect, null, this);

		// restart the game if reaching the edge
		if (this.player.x >= this.game.world.width) {
			this.game.time.events.add(1500, this.gameOver, this)
		}
	}

	getCurrentYear(playerPositionX) {
		const pixelsPerYear = this.mapWidthInPixels / this.years
		let relativeYear = Math.floor(playerPositionX / pixelsPerYear)
		if (relativeYear > this.years - 1) {
			relativeYear = this.years - 1
		}
		return this.startYear + relativeYear
	}

	gameOver() {
		this.game.state.start('HighScore')
	}

	restart() {
		this.game.state.start('Game')
	}

	playerHit(player, blockedLayer) {
		this.game.physics.arcade.collide(this.player, this.blockedLayer, this.playerHit, null, this)

		if (player.body.blocked.right) {
			this.soundOuch.play()
			// kill player
			this.player.die()
			// go to gameover after a few milliseconds
			this.game.time.events.add(1500, this.gameOver, this)
		}
	}

	updateScore(newScore) {
		// this.score = newScore
		let score = parseInt(this.scoreLabel.text, 10) + newScore
		this.scoreLabel.text = score
	}

	createBeers() {
		this.beers = this.game.add.group();
		this.beers.enableBody = true;
		let result = findObjectsByType('beer', this.map, 'objectsLayer');

		result.forEach((element) => {
			createFromTiledObject(element, this.beers)
		})
	}

	createAwards() {
		this.awards = this.game.add.group()
		this.awards.enableBody = true
		let result = findObjectsByType('award', this.map, 'objectsLayer')

		result.forEach((element) => {
			createFromTiledObject(element, this.awards)
		})
	}

	createCoffees() {
		this.coffees = this.game.add.group()
		this.coffees.enableBody = true
		let result = findObjectsByType('coffee', this.map, 'objectsLayer')

		result.forEach((element) => {
			createFromTiledObject(element, this.coffees)
		})
	}

	collect(player, collectable) {
		// show +500 notice
		if(collectable.type === 'beer') {
			this.player.speedUp()
		} else if(collectable.type === 'coffee') {
			this.player.slowDown()
		}

		let oneUp = this.game.add.text(
			collectable.x,
			collectable.y,
			'+' + config.coinValue,
			makeGreen(config.text.xl)
			)
		// oneUp.fixedToCamera = true
		// destroy it shortly thereafter
		setTimeout(() => {
			oneUp.destroy()
		}, 500)

		// play audio
		this.soundCoin.play()
		// update score
		// @todo different bonuses per collectable?
		this.updateScore(config.coinValue)
		// remove sprite
		collectable.destroy()
	}
}
