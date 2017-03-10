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
		fill: css.webBlack
	},
	xl: {
		font: '26px Liip Etica Bd',
		fill: css.webBlack,
		tabs: [150, 150, 200]
	}
}

export default {
	gameWidth: 760,
	gameHeight: 400,
	localStorageName: 'liip10yearsgame',
	text,
	css,
	backendDomain: 'http://localhost:3002',
	player: {
		speed: 300,
		weight: 2000
	},
	backGround: css.webWhite
}
