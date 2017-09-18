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
    var promise = new Promise((resolve, reject) => {
      return db.find({ _id: id }, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });

    // return run id
    return promise;

  },
  saveRun: () => {
    return db.find({ _id: id });
  }
}