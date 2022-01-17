/**
 * @name toCamelCase
 * @description makes string lower
 * @returns {string}
 * @param element
 * @param className
 */
export const hasClass = (element, className) => {
  const classes = element.getAttribute('class').split(' ')
  for (let i = 0; i < classes.length; i++) {
    if (classes[i] === className) {
      return true
    }
  }

  return false
}

export default hasClass
