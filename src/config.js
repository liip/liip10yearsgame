const css = {
	liipGreen: '#6EA644',
	liipGreen400: '#A4C339',
	liipGreen100: '#D0DD2C',
	webBlack: '#414141',
	black: '#000000',
	webWhite: '#F7F7F5',
	white: '#FFFFFF',
	orange: '#F8C026'
}

const cheerTexts = [
	'Yay!',
	'Wow!',
	'Phew!',
	'Boom!',
	'Awesome!'
]

const text = {
	sm: {
		font: '14px Liip Etica Bd',
		fill: css.webBlack
	},
	md: {
		font: '16px Liip Etica Bd',
		fill: css.webBlack
	},
	lg: {
		font: '20px Liip Etica Bd',
		fill: css.webBlack,
		tabs: [80, 80, 80, 100]
	},
	xl: {
		font: '26px Liip Etica Bd',
		fill: css.webBlack,
	},
	score: {
		font: '23px Ubuntu Mono', // we need a monospaced font here to avoid jiggling text
		color: css.webBlack,
		align: 'left',
		boundsAlignV: 'top',
		boundsAlignH: 'right'
	}
}

const points = {
	coin: 500,
	award: 1000,
}

const isPortrait = window.innerHeight > window.innerWidth

export default {
	gameHeight: window.innerHeight,
	groundPosition: 350,
	localStorageName: 'liip10yearsgame',
	text,
	css,
	points,
	cheerTexts,
	backendDomain: 'http://localhost:3002',
	player: {
		speed: isPortrait
			? 200
			: 280,
		minSpeed: 280,
		maxSpeed: 800,
		speedBonus: 50,
		weight: 2300,
		jump: 950
	},
	backGround: css.webWhite
}
