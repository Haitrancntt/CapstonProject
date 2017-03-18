/**
 * Created by HienNguyen on 03/03/2017.
 */
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/db_bss_vla';
var tb = 'tb_category';

module.exports =
{
    category_select: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({active: true}).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    category_selectlv1: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({_id: req.body.id}, {child: 0}).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    category_selectlv2: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                var splitstring = (req.body.id).split('.');
                collection.find({_id: parseInt(splitstring[0])}, {
                    _id: 0,
                    child: {$elemMatch: {_id: req.body.id}}
                }).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    category_deletelv1: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.updateOne({_id: req.body.id}, {$set: {active: false}}, function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    category_deletelv2: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                var splitstring = (req.body.id).split('.');
                collection.updateOne(
                    {_id: parseInt(splitstring[0]), 'list._id': req.body.id},
                    {
                        $set: {
                            'list.$.active': false
                        }
                    }
                    , function (err, result) {
                        db.close();
                        res.send(result);
                    })
            }
        })
    },

    category_createlv2: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = parseInt(req.body.id);
                getidlv2(id, function (err, doc) {
                    var collection = db.collection(tb);
                    var idlv1 = id;
                    if (doc[0].child == null) {
                        var idlv2 = 1;
                    } else {
                        var idlv2 = (doc[0].child).length + 1;
                    }
                    var name = ignoreSpaces(req.body.name);
                    collection.updateOne({_id: id},
                        {
                            $push: {
                                child: {
                                    _id: '' + idlv1 + '.' + idlv2,
                                    name: req.body.name,
                                    link: unsign(name).toLowerCase(),
                                    active: true
                                }
                            }
                        },
                        function (err, result) {
                            db.close();
                            res.send(result);
                        })
                });
            }
        })
    },

    category_createlv1: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                getid(function (err, doc) {
                    var collection = db.collection(tb);
                    var name = ignoreSpaces(req.body.name);
                    collection.insertOne({
                        _id: doc + 1,
                        name: req.body.name,
                        link: unsign(name).toLowerCase(),
                        active: true
                    }, function (err, result) {
                        db.close();
                        res.send(result);
                    })
                });
            }
        })
    },

    category_editlv2: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                var splitstring = (req.body.id).split('.');
                var name = ignoreSpaces(req.body.name);
                collection.updateOne(
                    {_id: parseInt(splitstring[0]), 'list._id': req.body.id},
                    {
                        $set: {
                            'list.$.name': req.body.name,
                            'list.$.link': unsign(name).toLowerCase()
                        }
                    }
                    , function (err, result) {
                        db.close();
                        res.send(result);
                    })
            }
        })
    },

    category_editlv1: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                var name = ignoreSpaces(req.body.name);
                collection.updateOne(
                    {_id: req.body.id},
                    {
                        $set: {
                            name: req.body.name,
                            link: unsign(name).toLowerCase()
                        }
                    }
                    , function (err, result) {
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

var getidlv2 = function (id, cb) {
    MongoClient.connect(mongoUrl, function (err, db) {
        if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
        else {
            var collection = db.collection(tb);
            collection.find({_id: id}).toArray(function (err, result) {
                db.close();
                cb(err, result)
            })
        }
    })
};

var unsign = function (str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    return str;
};

var ignoreSpaces = function (strg) {
    var temp = "";
    strg = '' + strg;
    var splitstring = strg.split(" ");
    for (var i = 0; i < splitstring.length; i++)
        temp += splitstring[i];
    return temp;
};