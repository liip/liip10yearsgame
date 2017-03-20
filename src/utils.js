import config from './config'


export const centerGameObjects = (objects) =>
  objects.map(object => object.anchor.setTo(0.5))

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
