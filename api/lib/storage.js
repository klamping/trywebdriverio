const Datastore = require('nedb');
const Promise = require('promise');
let db = new Datastore();

module.exports = {
  startRun: () => {
    return new Promise((resolve, reject) => {
      db.insert({
        timeStart: new Date()
      }, (err, newDoc) => {
        if (err) reject(err);
        else resolve(newDoc._id);
      })
    });
  },
  getRun: (id) => {
    return new Promise((resolve, reject) => {
      return db.find({ _id: id }, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  },
  updateRun: (id, deets) => {
    return new Promise((resolve, reject) => {
      return db.update({ _id: id }, deets, null, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  }
}