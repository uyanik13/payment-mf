export default () => {
  browser.executeAsync((done) => {
    setTimeout(done, 1000)
  })
}
