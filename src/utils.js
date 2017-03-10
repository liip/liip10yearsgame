import config from './config'


export const centerGameObjects = (objects) =>
  objects.map(object => object.anchor.setTo(0.5))

export const makeGreen = (textConfig) => {
	let conf = Object.assign({}, textConfig)
	conf.fill = config.css.liipGreen
	return conf
}
