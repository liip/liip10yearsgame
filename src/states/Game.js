import _ from 'lodash'
import config from '../config'
import Keyboard from '../objects/Keyboard'
import Phaser from 'phaser-ce'
import Player from '../objects/Player'
import { makeGreen, makeYellow, getRandomCheer } from '../utils'

export default class extends Phaser.State {
    init() {
        this.game.sound.mute = this.loadSoundMuteState()
        this.skipIntro = this.loadSkipIntro()
        this.jumpInputs = Keyboard.addKeyboard(this.game)
        this.initialOrientation = this.game.scale.isLandscape ? 'landscape' : 'portrait'
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

        if (!this.skipIntro) {
            // add intro layer
            this.addIntroLayer()
        }

        // this group holds all sprites/labels that should be fixed to camera
        this.infoLabels = this.game.add.group()
        this.infoLabels.fixedToCamera = true


        let logo = this.game.add.sprite(config.infoLabelsPadding, config.infoLabelsPadding, 'liipLogoSmall')
        logo.anchor.set(0, 0.5)
        this.infoLabels.add(logo)

        // setup player
        let playerStartPositionX = 0
        if (this.skipIntro) {
            playerStartPositionX = config.startPositionAfterIntro
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
        this.positionLabel = this.game.add.text(this.game.width / 2, config.infoLabelsPadding, '2007', Object.assign(config.text.xl, {
            boundsAlignH: 'center',
            boundsAlignV: 'top'
        }))
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
                if (this.game.sound.mute) {
                    this.muteBtn.setFrames(1, 1, 1)
                } else {
                    this.muteBtn.setFrames(0, 0, 0)
                }
            },
            this,
            muteBtnInitialFrame, muteBtnInitialFrame, muteBtnInitialFrame)
        this.muteBtn.anchor.set(0, 1)
        this.infoLabels.add(this.muteBtn)

        if (!this.skipIntro) {
            // add intro text
            this.firstJumpDone = false
            let howToJump = ( this.game.device.desktop ? 'Press space' : 'Tap your screen' )
            this.introLabel = this.game.add.text(this.game.width / 2, 200, howToJump + ' to jump', Object.assign(config.text.xl, config.text.center, {
                wordWrap: true,
                wordWrapWidth: this.game.width - 50
            }))
            this.introLabel.anchor.set(0.5, 0.5)
            this.infoLabels.add(this.introLabel)
        }

        // initialize wrong orientation overlay
        this.wrongOrientationLayer = this.game.add.group()
        this.wrongOrientationLayer.fixedToCamera = true

        let wrongOrientationRectangleSize = Math.max(this.game.width, this.game.height) + 500
        let wrongOrientationRectangle = this.game.add.bitmapData(wrongOrientationRectangleSize, wrongOrientationRectangleSize)
        wrongOrientationRectangle.ctx.beginPath()
        wrongOrientationRectangle.ctx.rect(0, 0, wrongOrientationRectangleSize, wrongOrientationRectangleSize)
        wrongOrientationRectangle.ctx.fillStyle = config.css.webWhite
        wrongOrientationRectangle.ctx.fill()
        this.wrongOrientationOverlayBackground = this.game.add.sprite(wrongOrientationRectangleSize / 2, wrongOrientationRectangleSize / 2, wrongOrientationRectangle)
        this.wrongOrientationOverlayBackground.anchor.setTo(0.5, 0.5)
        this.wrongOrientationLayer.add(this.wrongOrientationOverlayBackground)

        this.wrongOrientationOverlayText = this.game.add.text(this.game.width / 2, this.game.height / 2, 'Please reload game to change orientation!', Object.assign(config.text.xl, config.text.center, {
            wordWrap: true,
            wordWrapWidth: this.game.width - 50
        }))
        this.wrongOrientationOverlayText.anchor.setTo(0.5, 1)
        this.wrongOrientationLayer.add(this.wrongOrientationOverlayText)

        // reload button
        this.wrongOrientationOverlayReload = this.game.add.button(
            this.game.width / 2,
            this.game.height / 2,
            'replay',
            () => {
                window.location.reload()
            },
            this,
            1, 0, 1)
        this.wrongOrientationOverlayReload.anchor.set(0.5, 0)
        this.wrongOrientationOverlayReload.scale.setTo(0.7)
        this.wrongOrientationLayer.add(this.wrongOrientationOverlayReload)
        this.wrongOrientationLayer.callAll('kill')

        this.game.scale.onOrientationChange.add(() => {
            const width = document.documentElement.clientWidth * config.sizeFactor
            const height = document.documentElement.clientHeight * config.sizeFactor
            this.game.scale.setGameSize(width, height)
            const gameCenterX = this.game.width / 2
            const gameCenterY = this.game.height / 2
            if (( this.game.scale.isLandscape && this.initialOrientation === 'landscape' ) || ( this.game.scale.isPortrait && this.initialOrientation === 'portrait' )) {
                this.wrongOrientationLayer.callAll('kill')
                this.game.paused = false
            } else {
                this.game.paused = true
                this.wrongOrientationOverlayBackground.reset(gameCenterX, gameCenterY)
                this.wrongOrientationOverlayText.reset(gameCenterX, gameCenterY - 5)
                this.wrongOrientationOverlayText.wordWrapWidth = this.game.width - 50
                this.wrongOrientationOverlayReload.reset(gameCenterX, gameCenterY + 5)
                this.game.world.bringToTop(this.wrongOrientationLayer)
                this.wrongOrientationLayer.callAll('revive')
            }
        }, this)
    }

    update() {
        this.game.physics.arcade.collide(this.player, this.blockedLayer, this.playerHit, null, this)

        // set camera focus with some x offset
        this.camera.focusOnXY(this.player.x + (this.game.width / 4), this.player.y)

        if (this.player.alive) {
            // if player is back on ground reset to walk animation
            if (this.player.isJumping) {
                this.player.maybeLand()
            }
            if (this.jumpInputs.find(e => e.isDown)) {
                this.player.jump()
                if (!this.skipIntro && !this.firstJumpDone) {
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

        if (!this.skipIntro) {
            // enable intro barriers
            this.game.physics.arcade.overlap(this.player, this.introBarrierLayer, this.passIntroBarrier, null, this)
        }

        // show highscore of player reaches end of the world
        if (this.player.x >= this.game.world.width) {
            this.player.alive = false
            this.saveScore()
            // load game over state after a few milliseconds
            this.game.time.events.add(1500, this.gameOver, this, 'finished')
        }
    }


    gameOver(event) {
        this.cleanupWorld()
        // leave player
        this.player.body.moves = false
        let highScore = this.loadScore()
        let currentScore = parseInt(this.scoreLabel.text, 10)
        this.game.state.start('GameOver', false, false, event, currentScore, highScore)
    }

    cleanupWorld() {
        // cleanup game state - remove all items
        _(this.timelineObjectsLayer.children)
            .concat(this.objectsLayer.children)
            .concat(this.infoLabels.children)
            .filter()
            .each(item => item.destroy())
    }

    playerHit(player, blockedLayer) {
        if (player.body.blocked.right && player.alive) {
            this.soundOuch.play()
            // kill player
            player.die()
            this.saveScore()
            // load game over state after a few milliseconds
            this.game.time.events.add(1500, this.gameOver, this, 'gameover')
        }
    }

    addToScore(newScore) {
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
            let label = this.game.add.text(labelPositionX, labelPositionY, text, makeGreen(Object.assign(config.text.md, { align: 'center' })))
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
            let label = this.game.add.text(labelPositionX, labelPositionY, text, Object.assign(config.text.md, { align: 'center' }), this.yearLabelLayer)
            label.anchor.set(0.5)
            if (text !== '2007') {
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
        setTimeout(() => {
            // show notice
            let notice = this.game.add.text(x, y, text, style)

            // animate notice
            let noticeTween = this.game.add.tween(notice).to({
                alpha: 0,
                y: notice.y - 30
            }, 800, Phaser.Easing.Linear.None, true)
            noticeTween.onComplete.addOnce((notice) => {
                notice.destroy()
            })
        }, 200)
    }

    passYearBarrier(player, collectable) {
        // update year label
        this.positionLabel.text = collectable.yearLabel

        // animate new year label
        let yearTween = this.game.add.tween(this.positionLabel).to({
            alpha: 0,
            fontSize: 86
        }, 500, Phaser.Easing.Linear.None, true)
        yearTween.onComplete.addOnce((positionLabel) => {
            positionLabel.fontSize = 26
            positionLabel.alpha = 1
        })
        collectable.destroy()
    }

    passIntroBarrier(player, collectable) {
        if (collectable.intro_type === 'jump') {
            this.introLabel.text = 'Get Liip Achievements'
            this.firstJumpDone = true
        }
        if (collectable.intro_type === 'timeline') {
            this.introLabel.text = 'Get Extra Points (and get faster)'
        }
        if (collectable.intro_type === 'objects') {
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

        if (config.localStorageSupported) {
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
        if (config.localStorageSupported) {
            score = parseInt(localStorage.getItem(config.localStorageName + '-highscore'))
        }
        return score
    }

    /**
     * Save sound mute state to local storage
     */
    saveSoundMuteState(mute) {
        if (config.localStorageSupported) {
            localStorage.setItem(config.localStorageName + '-mute', mute)
        }
    }

    /**
     * Load sound mute state from local storage
     */
    loadSoundMuteState() {
        let mute = false
        if (config.localStorageSupported) {
            mute = localStorage.getItem(config.localStorageName + '-mute') === 'true'
        }
        return mute
    }

    /**
     * Save skip intro flag to local storage
     */
    saveSkipIntro() {
        if (config.localStorageSupported) {
            localStorage.setItem(config.localStorageName + '-skip-intro', true)
        }
    }

    /**
     * Load skip intro flag from local storage
     */
    loadSkipIntro() {
        let skipIntro = false
        if (config.localStorageSupported) {
            skipIntro = localStorage.getItem(config.localStorageName + '-skip-intro') === 'true'
        }
        return skipIntro
    }
}
