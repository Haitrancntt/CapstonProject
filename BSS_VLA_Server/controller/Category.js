/**
 * Created by HienNguyen on 03/03/2017.
 */
var MongoClient = require('mongodb').MongoClient;
var utility = require('../Utility');
var config = require('../Config');
var mongoUrl = config.mongourl;
var tb = 'tb_category';
var tbnews = 'tb_news';
var redis = require('redis').createClient(config.redisport, config.redisurl);

module.exports =
{
    /*view all category
     * select active : true */
    category_select_redis: function (req, res) {
        redis.get('menu', function (err, doc) {
            if (err) console.log('Unable to connect to the redis server. Error:', err);
            else if (doc) res.send(JSON.parse(doc));
            else {
                MongoClient.connect(mongoUrl, function (err, db) {
                    if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
                    else {
                        var collection = db.collection(tb);
                        collection.find({
                            active: true
                        }).toArray(function (err, result) {
                            redis.set('menu', JSON.stringify(result), function () {
                                db.close();
                                res.send(result);
                            })
                        })
                    }
                })
            }
        })
    },

    /*get category by link
     * Input : link */
    category_selectbylink: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var link = req.body.link;
                var collection = db.collection(tb);
                collection.find({
                    $or: [{
                        'link': link
                    }, {
                        'child.link': link
                    }]
                }).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    /*view category level 1 by id
     * Input : id */
    category_selectlv1: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var collection = db.collection(tb);
                collection.find({
                    _id: parseInt(id)
                }, {
                    child: 0
                }).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    /*view category level 2 by id
     * Input : id */
    category_selectlv2: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var collection = db.collection(tb);
                var splitstring = (id).split('.');
                collection.find({
                    _id: parseInt(splitstring[0])
                }, {
                    _id: 0,
                    child: {
                        $elemMatch: {
                            _id: id
                        }
                    }
                }).toArray(function (err, result) {
                    db.close();
                    res.send(result[0].child);
                })
            }
        })
    },

    /*create category level 1
     * Input : name */

    category_createlv1_redis: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                utility.getid(tb, function (err, number) {
                    var id = number + 1;
                    var collection = db.collection(tb);
                    var name = req.body.name;
                    var link = utility.unsign(utility.ignoreSpaces(name)).toLowerCase();
                    collection.find({
                        $or: [{
                            'link': link,
                            active: true
                        }, {
                            'child.link': link,
                            active: true
                        }]
                    }).toArray(function (err, result) {
                        if (result.length != 0) {
                            db.close();
                            res.json({result: true});
                        } else {
                            collection.insertOne({
                                _id: id,
                                name: name,
                                link: link,
                                active: true
                            }, function (err, result2) {
                                collection.find({
                                    active: true
                                }).toArray(function (err, result1) {
                                    redis.set('menu', JSON.stringify(result1), function () {
                                        db.close();
                                        res.json({result: false});
                                    })
                                })
                            })
                        }
                    })
                });
            }
        })
    },

    /*create category level 2
     * Input : id, name */

    category_createlv2_redis: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = parseInt(req.body.id);
                utility.getidlv2(id, tb, function (err, doc) {
                    var collection = db.collection(tb);
                    var idlv1 = id;
                    var idlv2 = 1;
                    if (doc[0].child) {
                        idlv2 = (doc[0].child).length + 1;
                    }
                    var name = req.body.name;
                    var link = utility.unsign(utility.ignoreSpaces(name)).toLowerCase();
                    collection.find({
                        $or: [{
                            'link': link,
                            active: true
                        }, {
                            'child.link': link,
                            active: true
                        }]
                    }).toArray(function (err, result) {
                        if (result.length != 0) {
                            db.close();
                            res.json({result: true});
                        } else {
                            collection.updateOne({
                                    _id: id
                                },
                                {
                                    $push: {
                                        child: {
                                            _id: '' + idlv1 + '.' + idlv2,
                                            name: name,
                                            link: link,
                                            active: true
                                        }
                                    }
                                },
                                function (err, result2) {
                                    collection.find({
                                        active: true
                                    }).toArray(function (err, result1) {
                                        redis.set('menu', JSON.stringify(result1), function () {
                                            db.close();
                                            res.json({result: false});
                                        })
                                    })
                                })
                        }
                    })
                });
            }
        })
    },

    /*edit category level 1
     * Input : id, name */

    category_editlv1_redis: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var name = req.body.name;
                var collection = db.collection(tb);
                var collectionnews = db.collection(tbnews);
                var link = utility.unsign(utility.ignoreSpaces(name)).toLowerCase();
                collection.find({
                    _id: parseInt(id)
                }).toArray(function (err, doc1) {
                    collectionnews.find({
                        category: doc1[0].name
                    }).toArray(function (err, result) {
                        if (result.length != 0) {
                            db.close();
                            res.json({result: true});
                        } else {
                            collection.find({
                                $or: [{
                                    'link': link,
                                    active: true
                                }, {
                                    'child.link': link,
                                    active: true
                                }]
                            }).toArray(function (err, result2) {
                                if (result2.length != 0) {
                                    db.close();
                                    res.json({result: true});
                                } else {
                                    collection.updateOne({
                                        _id: parseInt(id)
                                    }, {
                                        $set: {
                                            name: name,
                                            link: link
                                        }
                                    }, function (err, result3) {
                                        collection.find({
                                            active: true
                                        }).toArray(function (err, result1) {
                                            redis.set('menu', JSON.stringify(result1), function () {
                                                db.close();
                                                res.json({result: false});
                                            })
                                        })
                                    });
                                }
                            })
                        }
                    })
                })
            }
        })
    },

    /*edit category level 2
     * Input : id, name */

    category_editlv2_redis: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                var collectionnews = db.collection(tbnews);
                var id = req.body.id;
                var name = req.body.name;
                var splitstring = (id).split('.');
                var link = utility.unsign(utility.ignoreSpaces(name)).toLowerCase();
                collection.find({
                    _id: parseInt(splitstring[0])
                }, {
                    _id: 0,
                    child: {
                        $elemMatch: {
                            _id: id
                        }
                    }
                }).toArray(function (err, doc1) {
                    collectionnews.find({
                        category: doc1[0].child[0].name
                    }).toArray(function (err, result) {
                        if (result.length != 0) {
                            db.close();
                            res.json({result: true});
                        } else {
                            collection.find({
                                $or: [{
                                    'link': link,
                                    active: true
                                }, {
                                    'child.link': link,
                                    active: true
                                }]
                            }).toArray(function (err, result2) {
                                if (result2.length != 0) {
                                    db.close();
                                    res.json({result: true});
                                } else {
                                    collection.updateOne({
                                            _id: parseInt(splitstring[0]),
                                            'child._id': id
                                        },
                                        {
                                            $set: {
                                                'child.$.name': name,
                                                'child.$.link': link
                                            }
                                        }
                                        , function (err, result) {
                                            collection.find({
                                                active: true
                                            }).toArray(function (err, result1) {
                                                redis.set('menu', JSON.stringify(result1), function () {
                                                    db.close();
                                                    res.json({result: false});
                                                })
                                            })
                                        });
                                }
                            })
                        }
                    })
                })
            }
        });
    },

    /*delete category level 1
     status: true = > false
     Input : id */

    category_deletelv1_redis: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var collection = db.collection(tb);
                collection.updateOne({
                    _id: parseInt(id)
                }, {
                    $set: {
                        active: false
                    }
                }, function (err, result) {
                    collection.find({
                        active: true
                    }).toArray(function (err, result1) {
                        redis.set('menu', JSON.stringify(result1), function () {
                            db.close();
                            res.send(result);
                        })
                    })
                })
            }
        })
    },

    /*delete category level 2
     status: true = > false
     Input : id */

    category_deletelv2_redis: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                var id = req.body.id;
                var splitstring = (id).split('.');
                collection.updateOne({
                        _id: parseInt(splitstring[0]),
                        'child._id': id
                    },
                    {
                        $set: {
                            'child.$.active': false
                        }
                    }
                    , function (err, result) {
                        collection.find({
                            active: true
                        }).toArray(function (err, result1) {
                            redis.set('menu', JSON.stringify(result1), function () {
                                db.close();
                                res.send(result);
                            })
                        })
                    })
            }
        })
    },
};
