export const centerGameObjects = (objects) => {
  objects.forEach((object) => {
    object.anchor.setTo(0.5)
  })
}
