/**
 * Created by HienNguyen on 02/03/2017.
 */
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/db_bss_vla';
var tb = 'tb_news';
module.exports =
{
    news_select: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find().toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    news_user_selectcategory: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var page = req.body.page - 1;
                var collection = db.collection(tb);
                collection.find({
                    status: true,
                    draft: false,
                    post: true,
                    category: req.body.category
                }, null, {sort: {postdate: 1}}).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    news_user_selectdetail: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({
                    status: true,
                    draft: false,
                    post: true,
                    _id: req.body.id
                }).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    news_user_selectrecent: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var page = req.body.page;
                var collection = db.collection(tb);
                collection.find({status: true, draft: false, post: true}, null, {
                    sort: {postdate: 1}
                }).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    news_user_selectrelate: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({
                    status: true,
                    draft: false,
                    post: true,
                    category: req.body.category,
                    _id: {$lt: req.body.id}
                }, null, {
                    sort: {postdate: 1},
                    limit: 4
                }).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    news_admin_selectnews: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({
                    status: true,
                    draft: false
                }, null, {
                    sort: {createdate: 1}
                }).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    news_admin_selectdraft: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({
                        $or: [{
                            status: true,
                            draft: true,
                            tranfer: true
                        }, {
                            status: true,
                            draft: true,
                            owner: req.body.name
                        }]
                    }, null,
                    {
                        sort: {
                            createdate: 1
                        }
                    }
                ).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    news_editor_selectdraft: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({
                        $or: [{
                            status: true,
                            draft: true,
                            tranfer: false,
                            editor: req.body.name
                        }, {
                            status: true,
                            draft: true,
                            owner: req.body.name
                        }]
                    }, null,
                    {
                        sort: {
                            createdate: 1
                        }
                    }
                ).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    news_createdraft: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                getid(function (err, doc) {
                    var id = doc + 1;
                    var collection = db.collection(tb);
                    collection.insertOne({
                        _id: id,
                        title: req.body.title,
                        shortbrief: req.body.shortbrief,
                        content: req.body.content,
                        owner: req.body.owner,
                        createdate: req.body.createdate,
                        category: req.body.category,
                        status: true,
                        draft: true,
                        post: false,
                        tranfer: false
                    }, function (err, result) {
                        db.close();
                        res.send(result);
                    })
                })
            }
        })
    },

    news_edit: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                getid(function (err, doc) {
                    var id = doc + 1;
                    var collection = db.collection(tb);
                    collection.updateOne({_id: req.body.id, status: true, post: false}, {
                        $set: {
                            title: req.body.title,
                            shortbrief: req.body.shortbrief,
                            content: req.body.content,
                            category: req.body.category
                        }
                    }, function (err, result) {
                        db.close();
                        res.send(result);
                    })
                })
            }
        })
    },

    news_deletedraft: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.updateOne({
                        $or: [{
                            _id: req.body.id,
                            draft: true,
                            owner: req.body.owner,
                            editor: null,
                            tranfer: false
                        }, {
                            _id: req.body.id,
                            draft: true,
                            owner: req.body.owner,
                            editor: req.body.owner
                        }]
                    }, {
                        $set: {
                            status: false
                        }
                    }, function (err, result) {
                        db.close();
                        res.send(result)
                    }
                )
            }
        })
    },

    news_deactive: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.updateOne({
                        _id: req.body.id,
                        status: true,
                        draft: false
                    }, {
                        $set: {
                            post: false
                        }
                    }, function (err, result) {
                        db.close();
                        res.send(result)
                    }
                )
            }
        })
    },

    news_post: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.updateOne({
                        _id: req.body.id,
                        status: true,
                        draft: false
                    }, {
                        $set: {
                            post: true,
                            postdate: req.body.postdate
                        }
                    }, function (err, result) {
                        db.close();
                        res.send(result)
                    }
                )
            }
        })
    },

    news_approve: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.updateOne({
                        _id: req.body.id,
                        status: true
                    }, {
                        $set: {
                            draft: false
                        }
                    }, function (err, result) {
                        db.close();
                        res.send(result)
                    }
                )
            }
        })
    },

    news_editor_tranfer: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.updateOne({
                        _id: req.body.id,
                        status: true,
                        draft: true
                    }, {
                        $set: {
                            tranfer: true
                        }
                    }, function (err, result) {
                        db.close();
                        res.send(result)
                    }
                )
            }
        })
    },

    news_admin_tranfer: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.updateOne({
                        _id: req.body.id,
                        status: true,
                        draft: true
                    }, {
                        $set: {
                            tranfer: false,
                            editor: req.body.editor
                        }
                    }, function (err, result) {
                        db.close();
                        res.send(result)
                    }
                )
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