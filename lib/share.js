const Datastore = require('nedb');
const Promise = require('promise');

const db = new Datastore({ filename: 'data/nedb', autoload: true });

module.exports = {
  create: ({baseUrl, file}) => {
    return new Promise((resolve, reject) => {
      db.insert({
        baseUrl: baseUrl,
        file: file,
        createdOn: new Date()
      }, (err, newDoc) => {
        if (err) reject(err);
        else resolve(newDoc._id);
      })
    });
  },
  load: (id) => {
    return new Promise((resolve, reject) => {
      return db.find({ _id: id }, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  }
}