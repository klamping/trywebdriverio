const Datastore = require('nedb');
const Promise = require('promise');
let db = new Datastore();

module.exports = {
  startRun: () => {
    var promise = new Promise((resolve, reject) => {
      // create run id
      db.insert({
        timeStart: new Date()
      }, (err, newDoc) => {
        if (err) reject(err);
        else resolve(newDoc._id);
      })
    });

    // return run id
    return promise;
  },
  getResults: (id) => {
    return db.find({ _id: id });
  },
  saveRun: () => {
    return db.find({ _id: id });
  }
}