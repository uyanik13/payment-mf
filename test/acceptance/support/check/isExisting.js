/**
 * Check if the given element exists in the current DOM
 * @param  {String}   selector  Element selector
 */
export default (selector) => {
  expect($(selector).isExisting()).toBeTruthy()
}
