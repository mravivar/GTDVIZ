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

  findAllByyr: function(startyr, endyr,callback){
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      console.log("Connected successfully to server"+startyr+":"+ typeof endyr);
      var collection = db.collection(TABLE_NAME);
      //added projection
     collection.find({iyear:{ $gte: startyr, $lte: endyr }}, {iyear: 1}
          ).toArray(function(err, docs) {
          assert.equal(null, err);
          console.log('In the DBHelper'+docs.length);
          console.log(docs[0]);
          callback(docs);
          db.close();
        });
    });
  },
  aggregateEventsWithYearAndCont: function(startyr, endyr, callback){
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      console.log("Connected successfully to server"+startyr+":"+ typeof endyr);
      var collection = db.collection(TABLE_NAME);

     collection.aggregate([
              {$match: {iyear:{ $gte: startyr, $lte: endyr }}},
              {$group:
                {'_id': {year: '$iyear', continent: '$region_txt'},
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
  },

  aggregateEventsWithYear: function(startyr, endyr, callback){
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      console.log("Connected successfully to server"+startyr+":"+ typeof endyr);
      var collection = db.collection(TABLE_NAME);

     collection.aggregate([
              {$match: {iyear:{ $gte: startyr, $lte: endyr }}}
            , {$group:
                {_id: '$iyear',
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
  },

  aggregateEventsByYrs: function(callback){
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
