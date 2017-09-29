describe('the homepage', function () {
  it('should load', function () {
    browser.url('./');
    let title = browser.getTitle();

    // browser.saveScreenshot('temp');

    expect(title).to.equal('Home - Brené Brown');
  });
});
