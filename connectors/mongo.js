'use strict'

const MongoDb = require('mongodb');

module.exports = {
    db: undefined,
    init: function (options) {
        const self = this;
        return new Promise((resolve, reject) => {
            MongoDb.MongoClient.connect(options.url, (err, client) => {
                if (err) return reject(err);
                self.db = client.db(options.database);//db;
                resolve();
            });
        });
    },
    find: function (collection, query) {
        console.log('find=================');
        const self = this;
        return new Promise((resolve, reject) => {
            self.db.collection(collection).find(query).toArray((err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });        
    },
    findById: function (collection ,id) {
        return this.db.collection(collection).findOne({
            _id: id
        });
    }
}