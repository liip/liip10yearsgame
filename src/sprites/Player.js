import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
	constructor ({ game, x, y, asset }) {
		super(game, x, y, asset)
		this.anchor.setTo(0.5, 1)
		this.game.add.existing(this)

		this.animations.add('walk')
		this.animations.add('dead')

		this.jumpSound = this.game.add.audio('jump')
	}

	/**
	* Setup player physics and animations
	*/
	enable() {
		this.game.physics.arcade.enable(this)
		this.body.gravity.y = config.player.weight
		this.body.velocity.x = config.player.speed
		this.animations.play('walk', 15, true)
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
		this.animations.play('dead', 15, true)
	}

	/**
	* Slow down x speed
	*/
	slowDown() {
		if(this.body.velocity.x > config.player.minSpeed) {
			let newSpeed = this.body.velocity.x - config.player.speedBonus
			if(newSpeed < config.player.minSpeed) {
				newSpeed = config.player.minSpeed
			}
			this.body.velocity.x = newSpeed
		}
	}

	/**
	* Speed up x speed
	*/
	speedUp() {
		if(this.body.velocity.x < config.player.maxSpeed) {
			let newSpeed = this.body.velocity.x + config.player.speedBonus
			if(newSpeed > config.player.maxSpeed) {
				newSpeed = config.player.maxSpeed
			}
			this.body.velocity.x = newSpeed
		}
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
}
