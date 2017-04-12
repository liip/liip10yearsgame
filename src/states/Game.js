import Phaser from 'phaser'
import config from '../config'
import {makeGreen, makeYellow, getRandomCheer, isTouchDevice} from '../utils'
import Player from '../sprites/Player'
import _ from 'lodash'

export default class extends Phaser.State {
	init() {
		this.game.sound.mute = this.loadSoundMuteState()
		this.skipIntro = this.loadSkipIntro()
		if(this.game.device.desktop) {
			this.jumpInput = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
		} else {
			this.jumpInput = this.game.input.pointer1
		}
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

		if ( ! this.skipIntro ) {
			// add intro layer
			this.addIntroLayer()
		}

		// this group holds all sprites/labels that should be fixed to camera
		this.infoLabels = this.game.add.group()
		this.infoLabels.fixedToCamera = true


		let logo = this.game.add.sprite(config.infoLabelsPadding, config.infoLabelsPadding, 'liipLogoSmall')
		logo.anchor.set(0, 0.5)
		logo.scale.setTo(0.5)
		this.infoLabels.add(logo)

		// setup player
		let playerStartPositionX = 0
		if ( this.skipIntro ) {
			playerStartPositionX = 3100
		}
		this.player = new Player({
			game: this.game,
			x: playerStartPositionX,
			y: 250,
			asset: 'player'
		})
		this.player.enable()

		// score / highscore
		let scoreOffset = 0
		// if user had a previous highscore, show it
		let highscore = this.loadScore()
		if (highscore > 0) {
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
		let muteBtnInitialFrame = ( this.game.sound.mute ? 1 : 0 )
		this.muteBtn = this.game.add.button(
			config.infoLabelsPadding,
			this.game.height - (config.infoLabelsPadding / 2),
			'mute',
			() => {
				this.game.sound.mute = !this.game.sound.mute
				this.saveSoundMuteState(this.game.sound.mute)
				if ( this.game.sound.mute ) {
					this.muteBtn.setFrames(1, 1, 1)
				} else {
					this.muteBtn.setFrames(0, 0, 0)
				}
			},
			this,
			muteBtnInitialFrame, muteBtnInitialFrame, muteBtnInitialFrame)
		this.muteBtn.anchor.set(0, 1)
		this.muteBtn.scale.setTo(0.7)
		this.infoLabels.add(this.muteBtn)

		if ( ! this.skipIntro ) {
			// add intro text
			this.firstJumpDone = false
			let howToJump = isTouchDevice() ? 'Tap your screen' : 'Press space'
			this.introLabel = this.game.add.text(this.game.width / 2, 200, howToJump + ' to jump', Object.assign(config.text.xl, {boundsAlignH: 'center', boundsAlignV: 'center'}))
			this.introLabel.anchor.set(0.5, 0.5)
			this.infoLabels.add(this.introLabel)
		}
	}

	update() {
		this.game.physics.arcade.collide(this.player, this.blockedLayer, this.playerHit, null, this)

		// set camera focus with some x offset
		this.camera.focusOnXY(this.player.x + (this.game.width / 4), this.player.y)

		if (this.player.alive) {
			// if player is back on ground reset to walk animation
			if(this.player.isJumping) {
				this.player.maybeLand()
			}

			if (this.jumpInput.isDown) {
				this.player.jump()
				if ( ! this.skipIntro && ! this.firstJumpDone ) {
					this.firstJumpDone = true
					this.introLabel.text = ''
				}
			}

			this.addToScore(1)
		}

		// make objects collectable
		this.game.physics.arcade.overlap(this.player, this.objectsLayer, this.collect, null, this)

		// make timeline objects collectable
		this.game.physics.arcade.overlap(this.player, this.timelineObjectsLayer, this.collectTimelineObject, null, this)

		// enable year barriers
		this.game.physics.arcade.overlap(this.player, this.yearBarrierLayer, this.passYearBarrier, null, this)

		if ( ! this.skipIntro ) {
			// enable intro barriers
			this.game.physics.arcade.overlap(this.player, this.introBarrierLayer, this.passIntroBarrier, null, this)
		}

		// restart the game if reaching the edge
		if (this.player.x >= this.game.world.width) {
			this.game.time.events.add(1500, this.gameOver, this)
		}
	}

	gameOver() {
		// cleanup game state - remove all items
		_(this.timelineObjectsLayer.children)
			.concat(this.objectsLayer.children)
			.concat(this.infoLabels.children)
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

	addIntroLayer() {
		this.introBarrierLayer = this.game.add.group()
		this.introBarrierLayer.enableBody = true
		let introObjects = this.map.objects['introLayer']

		introObjects.forEach((introObject) => {
			let type = introObject.properties.intro
			let introBarrier = this.introBarrierLayer.create(introObject.x, 0)
			introBarrier.scale.x = 1
			introBarrier.scale.y = this.game.world.height
			introBarrier.intro_type = type
		})
	}

	collect(player, collectable) {
		// speed up player
		this.player.speedUp()

		this.showNotice(collectable.x, collectable.y, '+' + config.points.coin, makeYellow(config.text.xl))

		// play audio
		this.soundCoin.play()
		// update score
		this.addToScore(config.points.coin)
		// remove sprite
		collectable.destroy()
	}

	collectTimelineObject(player, collectable) {
		this.showNotice(collectable.x, collectable.y, getRandomCheer(), makeGreen(config.text.xl))

		// play audio
		this.soundCoin.play()
		// update score
		this.addToScore(config.points.achievement)
		// remove sprite
		collectable.destroy()
	}

	showNotice(x, y, text, style) {
		// show notice
		let notice = this.game.add.text(x, y, text, style)

		// animate notice
		let noticeTween = this.game.add.tween(notice).to({alpha: 0, y: notice.y - 30}, 800, Phaser.Easing.Linear.None, true)
		noticeTween.onComplete.addOnce((notice) => {
			notice.destroy()
		})
	}

	passYearBarrier(player, collectable) {
		// update year label
		this.positionLabel.text = collectable.yearLabel

		// animate new year label
		let yearTween = this.game.add.tween(this.positionLabel).to({alpha: 0, fontSize: 86}, 500, Phaser.Easing.Linear.None, true)
		yearTween.onComplete.addOnce((positionLabel) => {
			positionLabel.fontSize = 26
			positionLabel.alpha = 1
		})
		collectable.destroy()
	}

	passIntroBarrier(player, collectable) {
		if ( collectable.intro_type === 'jump' ) {
			this.introLabel.text = 'Get Liip Achievements'
			this.firstJumpDone = true
		}
		if ( collectable.intro_type === 'timeline' ) {
			this.introLabel.text = 'Get Extra Points (and get faster)'
		}
		if ( collectable.intro_type === 'objects' ) {
			this.introLabel.destroy()
			this.saveSkipIntro()
		}

		collectable.destroy()
	}

	/**
	 * Save score to local storage
	 */
	saveScore() {
		let previousScore = this.loadScore(),
			currentScore = parseInt(this.scoreLabel.text, 10)

		if ( config.localStorageSupported ) {
			// only set score if we don't yet have one or if currentScore is greater than previous one
			if (!previousScore || currentScore > previousScore) {
				localStorage.setItem(config.localStorageName + '-highscore', currentScore)
			}
		}
	}

	/**
	 * Load score from local storage
	 */
	loadScore() {
		let score = 0
		if ( config.localStorageSupported ) {
			score = parseInt(localStorage.getItem(config.localStorageName + '-highscore'))
		}
		return score
	}

	/**
	 * Save sound mute state to local storage
	 */
	saveSoundMuteState(mute) {
		if ( config.localStorageSupported ) {
			localStorage.setItem(config.localStorageName + '-mute', mute)
		}
	}

	/**
	 * Load sound mute state from local storage
	 */
	loadSoundMuteState() {
		let mute = false
		if ( config.localStorageSupported ) {
			mute = localStorage.getItem(config.localStorageName + '-mute') === 'true'
		}
		return mute
	}

	/**
	 * Save skip intro flag to local storage
	 */
	saveSkipIntro() {
		if ( config.localStorageSupported ) {
			localStorage.setItem(config.localStorageName + '-skip-intro', true)
		}
	}

	/**
	 * Load skip intro flag from local storage
	 */
	loadSkipIntro() {
		let skipIntro = false
		if ( config.localStorageSupported ) {
			skipIntro = localStorage.getItem(config.localStorageName + '-skip-intro') === 'true'
		}
		return skipIntro
	}
}
