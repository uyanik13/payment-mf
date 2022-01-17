/**
 * Check if the given element has the focus
 * @param  {String}   selectorX Element selectorX
 * @param  {String}   selectorY Element selectorY
 */
export default (selectorX, selectorY) => {
  const localtionX = $(selectorX).getLocation()
  const localtionY = $(selectorY).getLocation()

  expect(localtionX.y === localtionY.y && localtionX.x > localtionY.x).toBe(
    true
  )
}
