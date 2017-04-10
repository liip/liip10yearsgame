import config from './config'

/**
 * Center objects on screen
 * @param {array} objects
 */
export const centerGameObjects = (objects) =>
  objects.map(object => object.anchor.setTo(0.5))

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

/**
 * Test if device supports touch
 * @return {Boolean}
 */
export const isTouchDevice = () => {
	return 'ontouchstart' in window // works on most browsers
		|| navigator.maxTouchPoints // works on IE10/11 and Surface
}
