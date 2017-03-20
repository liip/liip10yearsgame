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
 * Find map objects by type
 * @param {string} type
 * @param {object} map
 * @param {string} layerName
 * @return {array}
 */
export const findObjectsByType = (type, map, layerName) => {
	return _
		.chain(map.objects[layerName])
		.filter(element => element.properties.type === type)
		.map(element => {
			element.y -= map.tileHeight
			return element
		})
		.value()
}

/**
 * Create sprite groups from tiled objects
 * @param {object} element
 * @param {string} group
 */
export const createFromTiledObject = (element, group) => {
	let sprite = group.create(element.x, element.y, element.properties.sprite)
	// copy all properties to the sprite
	Object.keys(element.properties).forEach(key => {
		sprite[key] = element.properties[key]
	})
}

export const getRandomCheer = () => {
	return config.cheerTexts[Math.floor(Math.random() * config.cheerTexts.length)];
}

/**
 * Test if device supports touch
 * @return {Boolean}
 */
export const isTouchDevice = () => {
  return 'ontouchstart' in window        // works on most browsers
      || navigator.maxTouchPoints;       // works on IE10/11 and Surface
}
