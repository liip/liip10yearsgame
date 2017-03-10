/* globals __DEV__ */
import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.State {
	init() {
		// this.game.state.start('HighScore')
	}

	preload() {
	}

	create() {
		this.map = this.game.add.tilemap('liip')
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
		this.player.body.gravity.y = config.player.weight
		this.game.camera.follow(this.player)

		// score
		this.scoreLabel = this.game.add.text(config.gameWidth - 70, 30, '0', config.text.md)
		this.scoreLabel.fixedToCamera = true

		// current position
		this.positionLabel = this.game.add.text(0, 0, '2007', Object.assign(config.text.xl, ({ boundsAlignH: "center" })))
		this.positionLabel.setTextBounds(0, 30, config.gameWidth, 30);
		this.positionLabel.fixedToCamera = true

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
		this.player.body.velocity.x = config.player.speed

		// load sounds
		this.soundCoin = this.game.add.audio('coin')
		this.soundOuch = this.game.add.audio('ouch')
		this.soundJump = this.game.add.audio('jump')

		// add objects
		this.createBeers();
		this.createAwards();
	}

	update() {
		this.game.physics.arcade.collide(this.player, this.blockedLayer, this.playerHit, null, this)

		if(this.player.alive) {
			if (this.keys.space.isDown) {
				this.playerJump()
			} else if (this.keys.down.isDown) {
				this.playerDuck()
			}

			this.updateScore(5)

			if (!this.keys.down.isDown && this.player.isDucked) {
				// change image and update the body size for the physics engine
				this.player.loadTexture('player')
				this.player.body.setSize(this.player.standDimensions.width, this.player.standDimensions.height)
				this.player.isDucked = false
			}

			// Update position label depending on the position of the player
			this.updatePositionLabel(this.player.x)
		}

		// make obejects collectable
		this.game.physics.arcade.overlap(this.player, this.beers, this.collect, null, this);
		this.game.physics.arcade.overlap(this.player, this.awards, this.collect, null, this);

		// restart the game if reaching the edge
		if (this.player.x >= this.game.world.width) {
			this.game.time.events.add(1500, this.restart, this)
		}
	}

	updatePositionLabel(playerPositionX) {
		if(playerPositionX > 3000) {
			this.positionLabel.text = '2017'
		} else if(playerPositionX > 2500) {
			this.positionLabel.text = '2016'
		} else if(playerPositionX > 2000) {
			this.positionLabel.text = '2015'
		} else if(playerPositionX > 1500) {
			this.positionLabel.text = '2014'
		} else if(playerPositionX > 1000) {
			this.positionLabel.text = '2013'
		} else if(playerPositionX > 500) {
			this.positionLabel.text = '2012'
		}
	}

	gameOver() {
		this.game.state.start('HighScore')
	}

	restart() {
		this.game.state.start('Game')
	}

	playerJump() {
		if (this.player.body.blocked.down) {
			this.soundJump.play();
			this.player.body.velocity.y -= 900
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
			this.soundOuch.play()
			// set to dead (this doesn't affect rendering)
			this.player.alive = false
			// stop moving to the right
			this.player.body.velocity.x = 0
			// change sprite image
			this.player.loadTexture('playerDead')
			// go to gameover after a few miliseconds
			this.game.time.events.add(1500, this.gameOver, this)
		}
	}

	updateScore (newScore) {
		// this.score = newScore
		let score = parseInt(this.scoreLabel.text) + newScore
		this.scoreLabel.text = score
	}

	findObjectsByType(type, map, layerName) {
		let result = new Array();
		map.objects[layerName].forEach(function(element){
			if(element.properties.type === type) {
				//Phaser uses top left, Tiled bottom left so we have to adjust
				//also keep in mind that some images could be of different size as the tile size
				//so they might not be placed in the exact position as in Tiled
				element.y -= map.tileHeight;
				result.push(element);
			}
		});

		return result;
	}

	createFromTiledObject(element, group) {
		let sprite = group.create(element.x, element.y, element.properties.sprite)
		// copy all properties to the sprite
		Object.keys(element.properties).forEach(key => {
			sprite[key] = element.properties[key]
		})
	}

	createBeers() {
		this.beers = this.game.add.group();
		this.beers.enableBody = true;
		let result = this.findObjectsByType('beer', this.map, 'objectsLayer');

		result.forEach((element) => {
			this.createFromTiledObject(element, this.beers)
		})
	}

	createAwards() {
		this.awards = this.game.add.group()
		this.awards.enableBody = true
		let result = this.findObjectsByType('award', this.map, 'objectsLayer')

		result.forEach((element) => {
			this.createFromTiledObject(element, this.awards)
		})
	}

	collect(player, collectable) {
		// play audio
		this.soundCoin.play()
		// remove sprite
		collectable.destroy()
	}

	render() {
	}
}
