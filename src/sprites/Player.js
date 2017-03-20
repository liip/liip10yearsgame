import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
	constructor ({ game, x, y, asset }) {
		super(game, x, y, asset)
		this.anchor.setTo(0.5, 1)
		this.game.add.existing(this)

		let playerDuckImg = this.game.cache.getImage('playerDuck')
		this.duckedDimensions = { width: playerDuckImg.width, height: playerDuckImg.height }
		this.standDimensions = { width: this.width, height: this.height }
		this.anchor.setTo(0.5, 1)

		this.jumpSound = this.game.add.audio('jump')
	}

	/**
	* Setup player physics and animations
	*/
	enable() {
		this.game.physics.arcade.enable(this)
		this.body.gravity.y = config.player.weight
		this.body.velocity.x = config.player.speed
		this.game.camera.follow(this)
	}

	/**
	* Stop moving and change image
	*/
	die() {
		// set to dead (this doesn't affect rendering)
		this.alive = false
		// stop moving
		this.body.velocity.x = 0
		// change sprite image
		this.loadTexture('playerDead')
	}

	/**
	* Slow down x speed
	* @todo  consider initial speed here
	*/
	slowDown() {
		this.body.velocity.x -= config.player.speedBonus
	}

	/**
	* Speed up x speed
	* @todo  consider initial speed here
	*/
	speedUp() {
		this.body.velocity.x += confing.player.speedBonus
	}

	/**
	* Player jump
	*/
	jump() {
		if (this.body.blocked.down) {
		  this.jumpSound.play()
		  this.body.velocity.y -= config.player.jump
		}
	}

	/**
	* Player duck
	*/
	duck() {
		// change image and update the body size for the physics engine
		this.loadTexture('playerDuck')
		this.body.setSize(this.duckedDimensions.width, this.duckedDimensions.height)
		//we use this to keep track whether it's ducked or not
		this.isDucked = true
	}

	/**
	* Stop ducking
	*/
	stopDucking() {
		// change image and update the body size for the physics engine
		this.loadTexture('player')
		this.body.setSize(this.standDimensions.width, this.standDimensions.height)
		this.isDucked = false
	}
}
