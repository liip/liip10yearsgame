import config from './config'

/**
 * Make a text config object green
 * @param {object} textConfig
 * @return {object}
 */
export const makeGreen = (textConfig) => {
	let conf = Object.assign({}, textConfig)
	conf.fill = config.css.liipGreen
	return conf
}

/**
 * Make a text config object yellow
 * @param {object} textConfig
 * @return {object}
 */
export const makeYellow = (textConfig) => {
	let conf = Object.assign({}, textConfig)
	conf.fill = config.css.yellow
	return conf
}

export const getRandomCheer = () => {
	return config.cheerTexts[Math.floor(Math.random() * config.cheerTexts.length)]
}
