import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
	constructor ({ game, x, y, asset }) {
		super(game, x, y, asset)
		this.anchor.setTo(0.5, 1)
		this.game.add.existing(this)

		this.animations.add('walk')
		this.animations.add('dead')
		this.animations.add('jump')

		this.jumpSound = this.game.add.audio('jump')
	}

	/**
	* Setup player physics and animations
	*/
	enable() {
		this.game.physics.arcade.enable(this)
		this.body.gravity.y = config.player.weight
		this.body.velocity.x = config.player.speed
		this.animations.play('walk', 18, true)
	}

	/**
	* Stop moving and change image
	*/
	die() {
		// set to dead (this doesn't affect rendering)
		this.alive = false
		// stop moving
		this.body.velocity.x = 0
		// stop all animations and change sprite image
		this.animations.stop(null, false)
		this.loadTexture('playerDead')
		this.animations.play('dead', 13.5, true)
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
			// stop walking animation and change sprite image
			this.animations.stop('walk', false)
			this.loadTexture('playerJump')
			this.animations.play('jump', 40, true)
			this.isJumping = true
		}
	}

	/**
	 * Player land
	 */
	maybeLand() {
		if (this.body.blocked.down) {
			this.animations.stop('jump', false)
			this.loadTexture('player')
			this.animations.play('walk', 18, true)
			this.isJumping = false
		}
	}
}
