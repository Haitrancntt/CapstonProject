/**
 * Created by HienNguyen on 21/03/2017.
 */
var MongoClient = require('mongodb').MongoClient;
var utility = require('../Utility');
var config = require('../Config');
var mongoUrl = config.mongourl;
var tb = 'tb_banner';
var redis = require('redis').createClient(config.redisport, config.redisurl);

module.exports =
{
    //-------------User------------
    /*select banner position 1*/

    banner_selectposition1user_redis: function (req, res) {
        redis.get('banner1', function (err, doc) {
            if (err) console.log('Unable to connect to the redis server. Error:', err);
            else if (doc) res.send(JSON.parse(doc));
            else {
                MongoClient.connect(mongoUrl, function (err, db) {
                    if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
                    else {
                        var collection = db.collection(tb);
                        collection.find({
                            active: true,
                            position: 1,
                            showhide: true
                        }, null, {
                            sort: {
                                order: 1
                            }
                        }).toArray(function (err, result) {
                            redis.set('banner1', JSON.stringify(result), function () {
                                db.close();
                                res.send(result);
                            })
                        })
                    }
                })
            }
        })
    },

    /*select banner position 2*/

    banner_selectposition2user_redis: function (req, res) {
        redis.get('banner2', function (err, doc) {
            if (err) console.log('Unable to connect to the redis server. Error:', err);
            else if (doc) res.send(JSON.parse(doc));
            else {
                MongoClient.connect(mongoUrl, function (err, db) {
                    if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
                    else {
                        var collection = db.collection(tb);
                        collection.find({
                            active: true,
                            position: 2,
                            showhide: true
                        }, null, {
                            sort: {
                                order: 1
                            }
                        }).toArray(function (err, result) {
                            redis.set('banner2', JSON.stringify(result), function () {
                                db.close();
                                res.send(result);
                            })
                        })
                    }
                })
            }
        })
    },

    //-------------End User------------
    //-------------CMS------------
    /*select all banner
     * select active : true */
    banner_select: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({
                    active: true
                }).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    /*select banner  by position
     * Input : position */
    banner_selectposition: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var position = req.body.position;
                var collection = db.collection(tb);
                collection.find({
                    active: true,
                    position: parseInt(position)
                }, null, {
                    sort: {
                        order: 1
                    }
                }).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    /*select banner by id
     * Input : id */
    banner_selectbyid: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var collection = db.collection(tb);
                collection.find({
                    _id: parseInt(id)
                }).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    /*create a banner
     * Input : name, position, image(64 base), linkimage */
    banner_create_redis: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                utility.getid(tb, function (err, number) {
                    var id = number + 1;
                    var name = req.body.name;
                    var image = req.body.image;
                    var linkimage = req.body.linkimage;
                    var collection = db.collection(tb);
                    var position = parseInt(req.body.position);
                    utility.getnumber_position(tb, position, function (err, doc2) {
                        var order = doc2 + 1;
                        collection.insertOne({
                            _id: id,
                            name: name,
                            image: image,
                            linkimage: linkimage,
                            position: position,
                            order: order,
                            showhide: false,
                            active: true
                        }, function (err, result) {
                            collection.find({
                                active: true,
                                position: 1,
                                showhide: true
                            }, null, {
                                sort: {
                                    order: 1
                                }
                            }).toArray(function (err, result1) {
                                redis.set('banner1', JSON.stringify(result1), function () {
                                    collection.find({
                                        active: true,
                                        position: 2,
                                        howhide: true
                                    }, null, {
                                        sort: {
                                            order: 1
                                        }
                                    }).toArray(function (err, result2) {
                                        redis.set('banner2', JSON.stringify(result2), function () {
                                            db.close();
                                            res.send(result);
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            }
        })
    },

    /*edit a banner
     * Input : id, name, image, linkimage */
    banner_edit_redis: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var name = req.body.name;
                var image = req.body.image;
                var linkimage = req.body.linkimage;
                var collection = db.collection(tb);
                collection.updateOne({_id: parseInt(id)}, {
                    $set: {
                        name: name,
                        image: image,
                        linkimage: linkimage
                    }
                }, function (err, result) {
                    collection.find({
                        active: true,
                        position: 1,
                        showhide: true
                    }, null, {
                        sort: {
                            order: 1
                        }
                    }).toArray(function (err, result1) {
                        redis.set('banner1', JSON.stringify(result1), function () {
                            collection.find({
                                active: true,
                                position: 2,
                                showhide: true
                            }, null, {
                                sort: {
                                    order: 1
                                }
                            }).toArray(function (err, result2) {
                                redis.set('banner2', JSON.stringify(result2), function () {
                                    db.close();
                                    res.send(result);
                                })
                            })
                        })
                    })
                })
            }
        })
    },

    /*delete a banner
     * active: true => false
     * Input : id */
    banner_delete_redis: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
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
                        active: true,
                        position: 1,
                        showhide: true
                    }, null, {
                        sort: {
                            order: 1
                        }
                    }).toArray(function (err, result1) {
                        redis.set('banner1', JSON.stringify(result1), function () {
                            collection.find({
                                active: true,
                                position: 2,
                                showhide: true
                            }, null, {
                                sort: {
                                    order: 1
                                }
                            }).toArray(function (err, result2) {
                                redis.set('banner2', JSON.stringify(result2), function () {
                                    db.close();
                                    res.send(result);
                                })
                            })
                        })
                    })
                })
            }
        })
    },

    /*show a banner on user
     * showhide false => true
     * Input : id */
    banner_show_redis: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var collection = db.collection(tb);
                collection.updateOne({
                    _id: parseInt(id)
                }, {
                    $set: {
                        showhide: true
                    }
                }, function (err, result) {
                    collection.find({
                        active: true,
                        position: 1,
                        showhide: true
                    }, null, {
                        sort: {
                            order: 1
                        }
                    }).toArray(function (err, result1) {
                        redis.set('banner1', JSON.stringify(result1), function () {
                            collection.find({
                                active: true,
                                position: 2,
                                showhide: true
                            }, null, {
                                sort: {
                                    order: 1
                                }
                            }).toArray(function (err, result2) {
                                redis.set('banner2', JSON.stringify(result2), function () {
                                    db.close();
                                    res.send(result);
                                })
                            })
                        })
                    })
                })
            }
        })
    },

    /*hide a banner on user
     * showhide true => false
     * Input : id */
    banner_hide_redis: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var collection = db.collection(tb);
                collection.updateOne({
                    _id: parseInt(id)
                }, {
                    $set: {
                        showhide: false
                    }
                }, function (err, result) {
                    collection.find({
                        active: true,
                        position: 1,
                        showhide: true
                    }, null, {
                        sort: {
                            order: 1
                        }
                    }).toArray(function (err, result1) {
                        redis.set('banner1', JSON.stringify(result1), function () {
                            collection.find({
                                active: true,
                                position: 2,
                                showhide: true
                            }, null, {
                                sort: {
                                    order: 1
                                }
                            }).toArray(function (err, result2) {
                                redis.set('banner2', JSON.stringify(result2), function () {
                                    db.close();
                                    res.send(result);
                                })
                            })
                        })
                    })
                })
            }
        })
    },

    /*order a banner on user
     * Input : id */
    banner_order_redis: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
                if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
                else {
                    var id = req.body.id;
                    var order = req.body.order;
                    var collection = db.collection(tb);
                    collection.updateOne({
                        _id: parseInt(id)
                    }, {
                        $set: {
                            order: parseInt(order)
                        }
                    }, function (err, result) {
                        collection.find({
                            active: true,
                            position: 1,
                            showhide: true
                        }, null, {
                            sort: {
                                order: 1
                            }
                        }).toArray(function (err, result1) {
                            redis.set('banner1', JSON.stringify(result1), function () {
                                collection.find({
                                    active: true,
                                    position: 2,
                                    showhide: true
                                }, null, {
                                    sort: {
                                        order: 1
                                    }
                                }).toArray(function (err, result2) {
                                    redis.set('banner2', JSON.stringify(result2), function () {
                                        db.close();
                                        res.send(result);
                                    })
                                })
                            })
                        })
                    })
                }
            }
        )
    }
//-------------End CMS------------
};