/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'

export default class extends Phaser.State {
	init () {}
	preload () {}

	create () {
		this.map = this.game.add.tilemap('level1');
		this.map.addTilesetImage('tiles_spritesheet', 'gameTiles');

		// create layers
		this.backgroundLayer = this.map.createLayer('backgroundLayer')
		this.blockedLayer = this.map.createLayer('blockedLayer')
		this.map.setCollisionBetween(1, 100000, true, 'blockedLayer')
		this.backgroundLayer.resizeWorld()

		// setup player
		this.player = this.game.add.sprite(100, 200, 'player')
		this.game.physics.arcade.enable(this.player)
		this.player.body.gravity.y = 1000
		this.game.camera.follow(this.player)

		// init keys
		this.cursors = this.game.input.keyboard.createCursorKeys()
		this.keys = this.game.input.keyboard.addKeys({
			'space': Phaser.KeyCode.SPACEBAR
		})

		// player ducks
		let playerDuckImg = this.game.cache.getImage('playerDuck')
		this.player.duckedDimensions = { width: playerDuckImg.width, height: playerDuckImg.height }
		this.player.standDimensions = { width: this.player.width, height: this.player.height }
		this.player.anchor.setTo(0.5, 1);

		// make the player move sideways continuously
		this.player.body.velocity.x = 200;
	}

	update () {
		this.game.physics.arcade.collide(this.player, this.blockedLayer, this.playerHit, null, this)

		// this.player.body.velocity.x = 300;
		if (this.keys.space.isDown) {
			this.playerJump()
		}
		else if (this.cursors.down.isDown) {
			this.playerDuck()
		}
		if (!this.cursors.down.isDown && this.player.isDucked) {
			this.player.loadTexture('player')
			this.player.body.setSize(this.player.standDimensions.width, this.player.standDimensions.height)
			this.player.isDucked = false
		}
	}

	playerJump () {
		if (this.player.body.blocked.down) {
			this.player.body.velocity.y -= 600
		}
	}

	playerDuck () {
		this.player.loadTexture('playerDuck')
		this.player.body.setSize(this.player.duckedDimensions.width, this.player.duckedDimensions.height)
		this.player.isDucked = true
	}

	playerHit (player, blockedLayer) {
		this.game.physics.arcade.collide(this.player, this.blockedLayer)
	}

	render () {
	}
}
