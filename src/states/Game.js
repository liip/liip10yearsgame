/* globals __DEV__ */
import Phaser from 'phaser'
import config from '../config'
import {makeGreen,getRandomCheer} from '../utils'
import Player from '../sprites/Player'
import Input from '../Input'
import _ from 'lodash'

export default class extends Phaser.State {
	init() {
		this.game.sound.mute = false
		this.yearChanged = false
		this.notices = []
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

		// create layers
		this.backgroundLayer = this.map.createLayer('backgroundLayer')
		this.blockedLayer = this.map.createLayer('blockedLayer')
		// this.game.world.width may cause problems with collisions, keep in mind
		this.map.setCollisionBetween(1, this.game.world.width, true, 'blockedLayer', true)
		this.backgroundLayer.resizeWorld()

		// add objects
		this.addObjectsLayer()

		// add timeline layer
		this.addTimelineObjectsLayer()

		// add timeline layer
		this.addYearLabelLayer()

		// this group holds all sprites/labels that should be fixed to camera
		this.infoLabels = this.game.add.group()
		this.infoLabels.fixedToCamera = true


		let logo = this.game.add.sprite(config.infoLabelsPadding, config.infoLabelsPadding, 'liipLogoSmall')
		logo.anchor.set(0, 0.5)
		logo.scale.setTo(0.5)
		this.infoLabels.add(logo)

		// setup player
		this.player = new Player({
			game: this.game,
			x: 0,
			y: 250,
			asset: 'player'
		})
		this.player.enable()

		// score / highscore
		let scoreOffset = 0
		// if user had a previous highscore, show it
		let highscore = this.loadScore()
		if (highscore) {
			this.highscoreLabel = this.game.add.text(this.game.width - config.infoLabelsPadding, config.infoLabelsPadding, ' / ' + highscore, config.text.score)
			this.highscoreLabel.anchor.set(1, 0.5)
			this.infoLabels.add(this.highscoreLabel)
			scoreOffset = this.highscoreLabel.width
		}
		this.scoreLabel = this.game.add.text(this.game.width - (config.infoLabelsPadding + scoreOffset), config.infoLabelsPadding, '0', makeGreen(config.text.score))
		this.scoreLabel.anchor.set(1, 0.5)
		this.infoLabels.add(this.scoreLabel)

		// current position
		this.positionLabel = this.game.add.text(this.game.width / 2, config.infoLabelsPadding, '2007', Object.assign(config.text.xl, {boundsAlignH: 'center', boundsAlignV: 'top'}))
		this.positionLabel.anchor.set(0.5, 0.5)
		this.infoLabels.add(this.positionLabel)

		// mute button
		/*
		this.muteBtn = this.game.add.text(this.game.width - 120, 35, 'mute', makeGreen(config.text.md))
		this.muteBtn.fixedToCamera = true
		this.muteBtn.inputEnabled = true
		this.muteBtn.events.onInputDown.add(() => {
			this.game.sound.mute = !this.game.sound.mute
		})*/

		// init input (keyboard or tap on mobile)
		this.input = new Input({ game: this.game })
	}

	update() {
		this.game.physics.arcade.collide(this.player, this.blockedLayer, this.playerHit, null, this)

		if (this.player.alive) {
			if (this.input.shouldJump()) {
				this.player.jump()
			}

			this.addToScore(1)

			if(this.yearChanged) {
				if (this.positionLabel.alpha > 0) {
					this.positionLabel.fontSize += 3
					this.positionLabel.alpha = (this.positionLabel.alpha - 0.05 < 0 ? 0 : this.positionLabel.alpha - 0.05)
				} else {
					this.yearChanged = false
					this.positionLabel.fontSize = 26
					this.positionLabel.alpha = 1
				}
			}

			// animate notices
			this.notices = this.notices.filter((notice) => {
				notice.y -= 1
				let newAlpha = notice.alpha - 0.02
				if (newAlpha < 0) {
					// destory notice if not visible anymore
					notice.destroy()
					return false
				} else {
					notice.alpha = newAlpha
					return true
				}
			})
		}

		// make objects collectable
		this.game.physics.arcade.overlap(this.player, this.objectsLayer, this.collect, null, this)

		// make timeline objects collectable
		this.game.physics.arcade.overlap(this.player, this.timelineObjectsLayer, this.collectTimelineObject, null, this)

		// enable year barriers
		this.game.physics.arcade.overlap(this.player, this.yearBarrierLayer, this.passYearBarrier, null, this)

		// restart the game if reaching the edge
		if (this.player.x >= this.game.world.width) {
			this.game.time.events.add(1500, this.gameOver, this)
		}
	}

	gameOver() {
		// cleanup game state - remove all items
		_(this.timelineObjectsLayer.children)
			.merge(this.objectsLayer.children)
			.merge(this.infoLabels.children)
			.filter()
			.each((item) => {
				item.destroy()
			})
		// leave player
		this.player.body.moves = false
		this.game.state.start('GameOver', false, false)
	}

	restart() {
		this.game.state.start('Game')
	}

	playerHit(player, blockedLayer) {
		if (player.body.blocked.right && this.player.alive) {
			this.soundOuch.play()
			// kill player
			this.player.die()
			// go to gameover after a few milliseconds
			this.game.time.events.add(1500, this.gameOver, this)
			this.saveScore()
		}
	}

	addToScore(newScore) {
		// this.score = newScore
		let score = parseInt(this.scoreLabel.text, 10) + newScore
		this.scoreLabel.text = score
	}

	addObjectsLayer() {
		this.objectsLayer = this.game.add.group()
		this.objectsLayer.enableBody = true
		let objects = this.map.objects['objectsLayer']

		objects.forEach((object) => {
			let sprite = this.objectsLayer.create(object.x, object.y - config.tileSize, object.properties.sprite)
			// copy all properties to the sprite
			Object.keys(object.properties).forEach(key => {
				sprite[key] = object.properties[key]
			})
		})
	}

	addTimelineObjectsLayer() {
		this.timelineObjectsLayer = this.game.add.group()
		this.timelineObjectsLayer.enableBody = true
		let timelineObjects = this.map.objects['timelineLayer']

		timelineObjects.forEach((timelineObject) => {
			let positionX = timelineObject.x
			let positionY = timelineObject.y - config.tileSize
			let text = timelineObject.properties.text
			let sprite = this.timelineObjectsLayer.create(positionX, positionY, timelineObject.properties.sprite)
			let labelPositionX = Math.floor(sprite.width / 2)
			let labelPositionY = config.tileSize + 20
			let label = this.game.add.text(labelPositionX, labelPositionY, text, makeGreen(Object.assign(config.text.md, {align: 'center'})))
			label.anchor.set(0.5)
			// copy all properties to the sprite
			Object.keys(timelineObject.properties).forEach(key => {
				sprite[key] = timelineObject.properties[key]
			})
			sprite.addChild(label)
		})
	}

	addYearLabelLayer() {
		this.yearLabelLayer = this.game.add.group()
		this.yearBarrierLayer = this.game.add.group()
		this.yearBarrierLayer.enableBody = true
		let yearObjects = this.map.objects['yearLayer']

		yearObjects.forEach((yearObject) => {
			let text = yearObject.properties.year
			let labelPositionX = yearObject.x
			// move first year label into viewport
			if(text === '2007') {
				labelPositionX += 30
			}
			let labelPositionY = yearObject.y
			let label = this.game.add.text(labelPositionX, labelPositionY, text, Object.assign(config.text.md, {align: 'center'}), this.yearLabelLayer)
			label.anchor.set(0.5)
			if(text !== '2007') {
				let yearBarrier = this.yearBarrierLayer.create(yearObject.x, 0)
				yearBarrier.scale.x = 1
				yearBarrier.scale.y = this.game.world.height
				yearBarrier.yearLabel = text
			}
		})
	}

	collect(player, collectable) {
		if(collectable.type === 'beer') {
			this.player.speedUp()
		} else if(collectable.type === 'coffee') {
			this.player.slowDown()
		}

		this.showNotice(collectable.x, collectable.y, '+' + config.points.coin)

		// play audio
		this.soundCoin.play()
		// update score
		this.addToScore(config.points.coin)
		// remove sprite
		collectable.destroy()
	}

	collectTimelineObject(player, collectable) {
		let points = 0
		if(collectable.type === 'award') {
			points = config.points.award
		}

		this.showNotice(collectable.x, collectable.y, getRandomCheer())

		// play audio
		this.soundCoin.play()
		// update score
		this.addToScore(points)
		// remove sprite
		collectable.destroy()
	}

	showNotice(x, y, text) {
		// show notice
		let notice = this.game.add.text(x, y, text, makeGreen(config.text.xl))
		this.notices.push(notice)
	}

	passYearBarrier(player, collectable) {
		// update year label
		this.positionLabel.text = collectable.yearLabel
		this.yearChanged = true
		collectable.destroy()
	}

	/**
	 * Save score to local storage
	 */
	saveScore() {
		let previousScore = this.loadScore(),
			currentScore = parseInt(this.scoreLabel.text, 10)

		// only set score if we don't yet have one or if currentScore is greater than previous one
		if (!previousScore || currentScore > previousScore) {
			localStorage.setItem('highscore', currentScore)
		}
	}

	/**
	 * Load score from local storage
	 */
	loadScore() {
		return parseInt(localStorage.getItem('highscore'))
	}
}
