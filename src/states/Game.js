/* globals __DEV__ */
import Phaser from 'phaser'
import config from '../config'
import {makeGreen,findObjectsByType,createFromTiledObject,getRandomCheer} from '../utils'
import _ from 'lodash'
import Player from '../sprites/Player'
import Input from '../Input'

export default class extends Phaser.State {
	init() {
		this.years = 11
		this.startYear = 2007
		this.game.sound.mute = false
	}

	preload() {
		// load sounds
		this.soundCoin = this.game.add.audio('coin')
		this.soundOuch = this.game.add.audio('ouch')
	}

	create() {
		// create map
		this.map = this.game.add.tilemap('liip')
		this.map.addTilesetImage('tiles_spritesheet', 'gameTiles')
		this.mapWidthInPixels = this.map.widthInPixels

		// create layers
		this.backgroundLayer = this.map.createLayer('backgroundLayer')
		this.blockedLayer = this.map.createLayer('blockedLayer')
		this.map.setCollisionBetween(1, 200000, true, 'blockedLayer', true)
		this.backgroundLayer.resizeWorld()

		// add objects
		this.createBeers()
		this.createCoffees()

		// add timeline layer
		this.addTimelineLayer()

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
		let scoreLabelStyle = {
			font: "20px 'Lucida Console', Monaco, monospace", // we need a monospaced font here to avoid "jumping" of text
			color: config.css.liipGreen,
			align: "right",
			boundsAlignV: "top",
			boundsAlignH: "right"
		}
		this.scoreLabel = this.game.add.text(0, 0, '0', scoreLabelStyle);
		this.scoreLabel.setTextBounds(0, 30, this.game.width - 30, 30);
		this.scoreLabel.fixedToCamera = true

		// current position
		this.positionLabel = this.game.add.text(0, 0, '2007', Object.assign(config.text.xl, {boundsAlignH: "center"}))
		this.positionLabel.setTextBounds(0, 30, this.game.width, 30)
		this.positionLabel.fixedToCamera = true

		// mute button
		this.muteBtn = this.game.add.text(this.game.width - 120, 35, 'mute', makeGreen(config.text.md))
		this.muteBtn.fixedToCamera = true
		this.muteBtn.inputEnabled = true
		this.muteBtn.events.onInputDown.add(() => {
			this.game.sound.mute = !this.game.sound.mute
		})

		// init input (keyboard or tap on mobile)
		this.input = new Input({ game: this.game })
	}

	update() {
		this.game.physics.arcade.collide(this.player, this.blockedLayer, this.playerHit, null, this)

		if (this.player.alive) {
			if (this.input.shouldJump()) {
				this.player.jump()
			}

			this.updateScore(5)

			// Update position label depending on the position of the player
			this.positionLabel.text = this.getCurrentYear(this.player.x)
		}

		// make objects collectable
		this.game.physics.arcade.overlap(this.player, this.beers, this.collect, null, this)
		this.game.physics.arcade.overlap(this.player, this.coffees, this.collect, null, this)

		// make timeline objects collectable
		this.game.physics.arcade.overlap(this.player, this.timelineLayer, this.collectTimelineObject, null, this)

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
		this.beers = this.game.add.group()
		this.beers.enableBody = true
		let result = findObjectsByType('beer', this.map, 'objectsLayer')

		result.forEach((element) => {
			createFromTiledObject(element, this.beers)
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

	addTimelineLayer() {
		this.timelineLayer = this.game.add.group()
		this.timelineLayer.enableBody = true
		let timelineObjects = this.map.objects['timelineLayer']

		timelineObjects.forEach((timelineObject) => {
			let positionX = timelineObject.x
			let positionY = timelineObject.y
			let text = timelineObject.properties.text
			let sprite = this.timelineLayer.create(positionX, positionY, timelineObject.properties.sprite)
			let labelPositionX = Math.floor(sprite.x + sprite.width / 2)
			let labelPositionY = this.game.height - 20
			let label = this.game.add.text(labelPositionX, labelPositionY, text, Object.assign(config.text.md, {align: "center"}))
			label.anchor.set(0.5);
			// copy all properties to the sprite
			Object.keys(timelineObject.properties).forEach(key => {
				sprite[key] = timelineObject.properties[key]
			})
			sprite.label = label
		})
	}

	collect(player, collectable) {
		if(collectable.type === 'beer') {
			this.player.speedUp()
		} else if(collectable.type === 'coffee') {
			this.player.slowDown()
		}

		// show +500 notice
		let oneUp = this.game.add.text(
			collectable.x,
			collectable.y,
			'+' + config.points.coin,
			makeGreen(config.text.xl)
			)
		// destroy it shortly thereafter
		setTimeout(() => {
			oneUp.destroy()
		}, 500)

		// play audio
		this.soundCoin.play()
		// update score
		// @todo different bonuses per collectable?
		this.updateScore(config.points.coin)
		// remove sprite
		collectable.destroy()
	}

	collectTimelineObject(player, collectable) {
		let points = 0;
		if(collectable.type === 'award') {
			points = config.points.award
		}

		collectable.label.destroy()

		// show notice
		let cheer = this.game.add.text(
			collectable.x,
			collectable.y,
			getRandomCheer(),
			makeGreen(config.text.xl)
		)
		// destroy it shortly thereafter
		setTimeout(() => {
			cheer.destroy()
		}, 800)

		// play audio
		this.soundCoin.play()
		// update score
		this.updateScore(points)
		// remove sprite
		collectable.destroy()
	}
}
