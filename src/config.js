const css = {
	liipGreen: '#6EA644',
	liipGreen400: '#A4C339',
	liipGreen100: '#D0DD2C',
	webBlack: '#414141',
	black: '#000000',
	webWhite: '#F7F7F5',
	white: '#FFFFFF',
	orange: '#F8C026',
	yellow: '#F8C026'
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
		font: '14px Liip Etica Bd, sans-serif',
		fill: css.webBlack
	},
	md: {
		font: '16px Liip Etica Bd, sans-serif',
		fill: css.webBlack
	},
	lg: {
		font: '20px Liip Etica Bd, sans-serif',
		fill: css.webBlack,
		tabs: [80, 80, 80, 100]
	},
	xl: {
		font: '26px Liip Etica Bd, sans-serif',
		fill: css.webBlack,
	},
	score: {
		font: '18px Ubuntu Mono, monospace', // we need a monospaced font here to avoid jiggling text
		color: css.webBlack,
		align: 'right',
		boundsAlignV: 'top',
		boundsAlignH: 'right'
	}
}

const points = {
	coin: 500,
	award: 1000,
}

let storage = (function() {
	let uid = new Date,
		storage,
		result
	try {
		(storage = window.localStorage).setItem(uid, uid)
		result = storage.getItem(uid) == uid
		storage.removeItem(uid)
		return result && storage
	} catch (exception) {}
}())

export default {
	gameHeight: window.innerHeight,
	localStorageName: 'liip10yearsgame',
	text,
	css,
	points,
	cheerTexts,
	backendDomain: 'http://localhost:3002',
	player: {
		speed: 280,
		minSpeed: 280,
		maxSpeed: 800,
		speedBonus: 50,
		weight: 2300,
		jump: 950
	},
	backGround: css.webWhite,
	startYear: '2007',
	infoLabelsPadding: 30,
	tileSize: 50,
	localStorageSupported: storage
}
