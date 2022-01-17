import clickElement from './clickElement'
import waitForBrowser from './../lib/waitForBrowser'

/**
 * Select an option of a select element
 * @param  {String}   inputWrapperSelector Value to select by
 * @param  {String}   inputValue     Element selector
 */
export default (inputWrapperSelector, inputValue) => {
  clickElement('click', 'element', inputWrapperSelector)

  waitForBrowser()

  if (inputValue.length > 0) {
    clickElement(
      'click',
      'element',
      `//div[contains(@class, 'v-list-item__title') and normalize-space(text()) = "${inputValue}"]`
    )
  } else {
    clickElement('click', 'element', 'body')
  }

  waitForBrowser()
}
