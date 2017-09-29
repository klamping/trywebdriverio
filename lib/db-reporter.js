const events = require('events');
const storage = require('./storage.js')

/**
 * Initialize a new `spec` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */
class DbReporter extends events.EventEmitter {
  constructor (baseReporter, config, options = {}) {
    super()

    this.baseReporter = baseReporter
    this.config = config
    this.options = options

    this.on('runner:start', function (runner) {
      storage.updateRun(options.runId, { timeStart: Date.now(), isRunning: true })
    })

    this.on('suite:start', function (suite) {
    })

    this.on('test:pending', function (test) {
    })

    this.on('test:pass', function (test) {
    })

    this.on('test:fail', function (test) {
    })

    this.on('suite:end', function (suite) {
    })

    this.on('runner:end', function (runner) {
    })

    this.on('end', function () {
      storage.updateRun(options.runId, { timeEnd: Date.now(), isRunning: false })
    })
  }
}

DbReporter.reporterName = 'DbReporter';

exports = module.exports = DbReporter;