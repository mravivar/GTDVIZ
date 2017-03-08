'use strict';
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var TABLE_NAME='events';
// Connection URL
var url = 'mongodb://localhost:27017/gtd';

module.exports = {
  callFn: function(a, callback){
    console.log('In the DBHelpper:'+a);
    callback(a+10);
  },

  aggregateEventsByYear: function(callback){
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
      var collection = db.collection(TABLE_NAME);

     collection.aggregate([
              {$match: {}}
            , {$group:
                {_id: '$iyear',
                //total: {$sum: '$nkill'},
                count : {$sum: 1}
              }
              }
          ]).toArray(function(err, docs) {
          assert.equal(null, err);
          console.log('In the DBHelper'+docs.length);
          callback(docs);
          db.close();
        });
    });
  }
};
// Use connect method to connect to the server
/*
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  var collection = db.collection(TABLE_NAME);

 collection.aggregate([
          {$match: {}}
        , {$group:
            {_id: '$iyear',
            total: {$sum: '$nkill'},
            count : {$sum: 1}
          }
          }
      ]).toArray(function(err, docs) {
      assert.equal(null, err);
      console.log(docs);
      db.close();
    });
});*/
