/* globals __DEV__ */
import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.State {
	init() {
	}

	preload() {
	}

	create() {
		this.map = this.game.add.tilemap('level1')
		this.map.addTilesetImage('tiles_spritesheet', 'gameTiles')

		// create layers
		this.backgroundLayer = this.map.createLayer('backgroundLayer')
		this.blockedLayer = this.map.createLayer('blockedLayer')
		this.map.setCollisionBetween(1, 100000, true, 'blockedLayer')
		this.backgroundLayer.resizeWorld()

		this.logo = this.game.add.sprite(20, 30, 'liipLogo')
		this.logo.scale.setTo(0.2)
		this.logo.fixedToCamera = true

		// setup player
		this.player = this.game.add.sprite(100, 200, 'player')
		this.game.physics.arcade.enable(this.player)
		this.player.body.gravity.y = 1500
		this.game.camera.follow(this.player)

		// score
		this.scoreLabel = game.add.text(config.gameWidth-70, 30, 'score: 0', { font: '14px Open Sans', fill: '#414141' })
		this.score = 0
		this.scoreLabel.fixedToCamera = true

		// init keys
		// this.cursors = this.game.input.keyboard.createCursorKeys()
		this.keys = this.game.input.keyboard.addKeys({
			space: Phaser.KeyCode.SPACEBAR,
			down: Phaser.KeyCode.DOWN
		})

		let playerDuckImg = this.game.cache.getImage('playerDuck')
		this.player.duckedDimensions = {width: playerDuckImg.width, height: playerDuckImg.height}
		this.player.standDimensions = {width: this.player.width, height: this.player.height}
		this.player.anchor.setTo(0.5, 1)

		// make the player move sideways continuously
		this.player.body.velocity.x = 200
	}

	update() {
		this.game.physics.arcade.collide(this.player, this.blockedLayer, this.playerHit, null, this)

		if (this.keys.space.isDown) {
			this.playerJump()
		} else if (this.keys.down.isDown) {
			this.playerDuck()
		}

		if (!this.keys.down.isDown && this.player.isDucked) {
			//change image and update the body size for the physics engine
			this.player.loadTexture('player')
			this.player.body.setSize(this.player.standDimensions.width, this.player.standDimensions.height)
			this.player.isDucked = false
		}

		//restart the game if reaching the edge

		if (this.player.x >= this.game.world.width) {
			this.game.time.events.add(1500, this.gameOver, this)
		}
	}

	gameOver() {
		this.game.state.start('Game')
	}

	playerJump() {
		if (this.player.body.blocked.down) {
			this.player.body.velocity.y -= 700
		}
	}

	playerDuck() {
		//change image and update the body size for the physics engine
		this.player.loadTexture('playerDuck')
		this.player.body.setSize(this.player.duckedDimensions.width, this.player.duckedDimensions.height)
		//we use this to keep track whether it's ducked or not
		this.player.isDucked = true
	}

	playerHit(player, blockedLayer) {
		this.game.physics.arcade.collide(this.player, this.blockedLayer)

		if (player.body.blocked.right) {
			//set to dead (this doesn't affect rendering)
			this.player.alive = false
			//stop moving to the right
			this.player.body.velocity.x = 0
			//change sprite image
			this.player.loadTexture('playerDead')
			//go to gameover after a few miliseconds
			this.game.time.events.add(1500, this.gameOver, this)
		}
	}

	render() {
	}
}
