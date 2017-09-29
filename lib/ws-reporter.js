const WebSocket = require('ws');

const events = require('events');

/**
 * Initialize a new `spec` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */
class WsReporter extends events.EventEmitter {
  constructor (baseReporter, config, options = {}) {
    super()

    this.baseReporter = baseReporter
    this.config = config
    this.options = options

    const ws = new WebSocket('ws://localhost:3000');

    this.on('start', function () {
      // ws.send('start');
    })

    this.on('runner:start', function (runner) {
      ws.send('test started');
    })

    this.on('suite:start', function (suite) {
      ws.send('suite started', suite);
    })

    this.on('test:pending', function (test) {
      ws.send('test:pending', test);
    })

    this.on('test:pass', function (test) {
      ws.send('test:pass');
    })

    this.on('test:fail', function (test) {
      ws.send('test:fail', test);
    })

    this.on('suite:end', function (suite) {
      ws.send('suite:end', suite);
    })

    this.on('runner:end', function (runner) {
      ws.send('runner:end', runner);
    })

    this.on('end', function () {
      ws.send('end');
    })
  }
}

WsReporter.reporterName = 'WsReporter';

exports = module.exports = WsReporter;