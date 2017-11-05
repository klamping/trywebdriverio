module.exports = {
  baseUrl: 'http://webdriver.io',
  file: `describe('webdriver.io api page', function() {
  it('should be able to filter for commands', function () {
    browser.url('./api.html');
    // filtering property commands
    $('.searchbar input').setValue('getT');
    // get all results that are displayed
    var results = $$('.commands.property a').filter(function (link) {
        return link.isVisible();
    });
    // assert number of results
    expect(results.length).to.be.equal(3);
    // check out second result
    results[1].click();
    expect($('.doc h1').getText()).to.be.equal('GETTEXT');
  });
});`
}