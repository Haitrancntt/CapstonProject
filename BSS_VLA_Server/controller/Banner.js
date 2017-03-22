/**
 * Created by HienNguyen on 21/03/2017.
 */
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/db_bss_vla';
var tb = 'tb_banner';

module.exports =
{
    banner_select: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find().toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    banner_selectbyid: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({_id: req.body.id}).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    banner_selectshow: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({showhide: true}).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    banner_create: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                getid(function (err, doc) {
                    var id = doc + 1;
                    var collection = db.collection(tb);
                    collection.insertOne({
                        _id: id,
                        name: req.body.name,
                        image: req.body.image,
                        showhide: false,
                        active: true
                    }, function (err, result) {
                        db.close();
                        res.send(result);
                    })
                })
            }
        })
    },

    banner_delete: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.updateOne({_id: req.bod.id}, {
                    $set: {
                        active: false
                    }
                }, function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    banner_show: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.updateOne({_id: req.bod.id}, {
                    $set: {
                        showhide: true
                    }
                }, function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    banner_hide: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.updateOne({_id: req.bod.id}, {
                    $set: {
                        showhide: false
                    }
                }, function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    }
};
var getid = function (cb) {
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
        else {
            var collection = db.collection(tb);
            collection.find().count(function (err, result) {
                db.close();
                cb(err, result);
            })
        }
    })
};