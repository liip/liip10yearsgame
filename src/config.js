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

const text = {
	sm: {
		font: '14px Open Sans',
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
	}
}

const isPortrait = screen.orientation.type.includes('portrait')
const { gameHeight } = isPortrait
	? { gameHeight: 760 }
	: { gameHeight: 400 }

export default {
	gameHeight,
	localStorageName: 'liip10yearsgame',
	text,
	css,
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
	coinValue: 500,
	backGround: css.webWhite
}
