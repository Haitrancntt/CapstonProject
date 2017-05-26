/**
 * Created by HienNguyen on 02/03/2017.
 */
var MongoClient = require('mongodb').MongoClient;
var utility = require('../Utility');
var config = require('../Config');
var mongoUrl = config.mongourl;
var tb = 'tb_news';
var tbrevision = 'tb_revisionnews';
var es = require('elasticsearch');
var client = new es.Client({
    hosts: config.esurl
});

module.exports =
{
    /*view revision news by id
     * Input : id */
    news_selectrevisionnews: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var collection = db.collection(tbrevision);
                collection.find({
                        idnews: id
                    }, null,
                    {
                        sort: {
                            date: -1
                        }

                    }).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    /*view news by category
     * Input : link */

    news_selectcategory_es: function (req, res) {
        var link = req.body.link;
        client.search({
            index: 'bss',
            type: tb,
            body: {
                query: {
                    "query_string": {
                        "fields": ["link"],
                        "query": link
                    }
                },
                sort: {
                    "order": "desc",
                    "modifydate": "desc"
                }
            }
        }, function (err, resp, status) {
            res.send(resp.hits.hits);
        });
    },

    news_search_es: function (req, res) {
        var textsearch = req.body.textsearch;
        client.search({
            index: 'bss',
            type: tb,
            body: {
                query: {
                    "query_string": {
                        "fields": ["title"],
                        "query": "*" + textsearch + "*"
                    }
                },
                sort: {
                    "order": "desc",
                    "modifydate": "desc"
                }
            }
        }, function (err, resp, status) {
            res.send(resp.hits.hits);
        });
    },

    /*view news by id
     * Input : id */

    news_selectdetail_es: function (req, res) {
        var id = req.body.id;
        client.get({
            index: 'bss',
            type: tb,
            id: id
        }, function (err, resp, status) {
            res.send(resp);
        });
    },

    /*view news recently*/

    news_selectrecent_es: function (req, res) {
        client.search({
            index: 'bss',
            type: tb,
            body: {
                query: {
                    "query_string": {
                        "fields": ["title"],
                        "query": "**"
                    }
                },
                sort: {
                    "order": "desc",
                    "modifydate": "desc"
                }
            }
        }, function (err, resp, status) {
            res.send(resp.hits.hits);
        });
    },

    /*view news relation*/

    news_selectrelate_es: function (req, res) {
        var link = req.body.link;
        client.search({
            index: 'bss',
            type: tb,
            body: {
                from: 0,
                size: 4,
                query: {
                    "query_string": {
                        "fields": ["link"],
                        "query": link
                    }
                },
                sort: {
                    "order": "desc",
                    "modifydate": "desc"
                }
            }
        }, function (err, resp, status) {
            res.send(resp.hits.hits);
        });
    },
    //----------End User----------
    //----------CMS----------
    /*select news by id
     * input : id */
    news_selectbyid: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
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
    /*view list of news*/
    news_selectnews: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({
                    status: true,
                    draft: false
                }, null, {
                    sort: {
                        modifydate: -1
                    }
                }).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    /*view detail news by id
     * Input : id */
    news_selectnewsdetail: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var collection = db.collection(tb);
                collection.find({
                    status: true,
                    draft: false,
                    _id: parseInt(id)
                }).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    /*view list draft by name
     * Input : name */
    news_selectdraft: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var name = req.body.name;
                var collection = db.collection(tb);
                collection.find({
                        status: true,
                        draft: true,
                        editor: name
                    }, null,
                    {
                        sort: {
                            modifydate: -1
                        }
                    }
                ).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    /*view detail draft by id
     * Input : id*/
    news_selectdraftdetail: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var name = req.body.name;
                var collection = db.collection(tb);
                collection.find({
                    status: true,
                    draft: true,
                    editor: name,
                    _id: parseInt(id)
                }).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },


    /*create draft
     * Input :  title, shortbrief, content, category, createdate, thumbnail, owner */
    news_createdraft: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                utility.getid(tb, function (err, number) {
                    var id = number + 1;
                    var title = req.body.title;
                    var shortbrief = req.body.shortbrief;
                    var content = req.body.content;
                    var category = req.body.category;
                    var owner = req.body.owner;
                    var thumbnail = req.body.thumbnail;
                    var date = req.body.createdate;
                    var editor = req.body.editor;
                    var link = utility.unsign(utility.ignoreSpaces(category)).toLowerCase();
                    var collection = db.collection(tb);
                    collection.insertOne({
                        _id: id,
                        title: title,
                        shortbrief: shortbrief,
                        content: content,
                        createdate: date,
                        owner: owner,
                        modifydate: date,
                        category: category,
                        link: link,
                        editor: editor,
                        thumbnail: thumbnail,
                        status: true,
                        draft: true,
                        post: false,
                        order: 0
                    }, function (err, result) {
                        db.close();
                        res.send(result);
                    })
                })
            }
        })
    },

    /*edit draft by id
     create old draft in news revision
     Input : id, title, shortbrief, content, email, category, thumbnail, modifydate */
    news_edit: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var title = req.body.title;
                var shortbrief = req.body.shortbrief;
                var content = req.body.content;
                var category = req.body.category;
                var date = req.body.modifydate;
                var thumbnail = req.body.thumbnail;
                var collection = db.collection(tb);
                var collectionrevision = db.collection(tbrevision);
                var link = utility.unsign(utility.ignoreSpaces(req.body.category)).toLowerCase();
                collection.find({
                    _id: parseInt(id),
                    status: true,
                    post: false
                }).toArray(function (err, doc) {
                    collectionrevision.insertOne({
                        idnews: id,
                        title: doc[0].title,
                        shortbrief: doc[0].shortbrief,
                        content: doc[0].content,
                        date: date,
                        category: doc[0].category
                    }, function (err, result1) {
                        collection.updateOne({
                            _id: parseInt(id),
                            status: true,
                            post: false
                        }, {
                            $set: {
                                title: title,
                                shortbrief: shortbrief,
                                content: content,
                                category: category,
                                link: link,
                                thumbnail: thumbnail,
                                modifydate: date
                            }
                        }, function (err, result) {
                            db.close();
                            res.send(result);
                        })
                    })
                })
            }
        })
    },

    /*delete draft by id
     status: true => false
     Input : id */
    news_deletedraft: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var collection = db.collection(tb);
                collection.updateOne({
                        _id: parseInt(id)

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

    /*post news by id
     post: false => true
     Input : id, modifydate */

    news_post_es: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var modifydate = req.body.modifydate;
                var collection = db.collection(tb);
                collection.updateOne({
                        _id: parseInt(id)
                    }, {
                        $set: {
                            post: true,
                            modifydate: modifydate
                        }
                    }, function (err, result) {
                        collection.find({
                            _id: parseInt(id)
                        }).toArray(function (err, doc) {
                            client.index({
                                index: 'bss',
                                type: tb,
                                id: id,
                                body: {
                                    "id": id,
                                    "title": doc[0].title,
                                    "shortbrief": doc[0].shortbrief,
                                    "content": doc[0].content,
                                    "createdate": doc[0].createdate,
                                    "owner": doc[0].owner,
                                    "modifydate": doc[0].modifydate,
                                    "category": doc[0].category,
                                    "link": doc[0].link,
                                    "editor": doc[0].editor,
                                    "thumbnail": doc[0].thumbnail,
                                    "status": doc[0].status,
                                    "draft": doc[0].draft,
                                    "post": doc[0].post,
                                    "order": doc[0].order
                                }
                            }, function (err, resp, status) {
                                db.close();
                                res.send(result);
                            });
                        })
                    }
                )
            }
        })
    },

    /*deactive news by id
     post: true => false
     Input : id */
    news_deactive_es: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var collection = db.collection(tb);
                collection.updateOne({
                        _id: parseInt(id)
                    }, {
                        $set: {
                            post: false
                        }
                    }, function (err, result) {
                        client.delete({
                            index: 'bss',
                            type: tb,
                            id: id
                        }, function (err, resp, status) {
                            db.close();
                            res.send(result);
                        });
                    }
                )
            }
        })
    },

    /*approve a draft into news by id
     draft: true => false
     Input : id, modifydate */
    news_approve: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var modifydate = req.body.modifydate;
                var collection = db.collection(tb);
                collection.updateOne({
                        _id: parseInt(id)
                    }, {
                        $set: {
                            draft: false,
                            modifydate: modifydate
                        }
                    }, function (err, result) {
                        db.close();
                        res.send(result)
                    }
                )
            }
        })
    },

    /*tranfer a draft to somebody
     * Input : id, editor, modifydate */
    news_tranfer: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var modifydate = req.body.modifydate;
                var editor = req.body.editor;
                var collection = db.collection(tb);
                collection.updateOne({
                        _id: parseInt(id)
                    }, {
                        $set: {
                            editor: editor,
                            modifydate: modifydate
                        }
                    }, function (err, result) {
                        db.close();
                        res.send(result)
                    }
                )
            }
        })
    },

    /*push a news on top page by id
     order: 0 => 1
     Input : id, modifydate */
    news_push: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var modifydate = req.body.modifydate;
                var collection = db.collection(tb);
                collection.updateOne({
                        _id: parseInt(id)
                    }, {
                        $set: {
                            order: 1,
                            modifydate: modifydate
                        }
                    }, function (err, result) {
                        client.delete({
                            index: 'bss',
                            type: tb,
                            id: id
                        }, function (err, resp, status) {
                            collection.find({_id: parseInt(id)}).toArray(function (err, doc) {
                                client.index({
                                    index: 'bss',
                                    type: tb,
                                    id: id,
                                    body: {
                                        "id": id,
                                        "title": doc[0].title,
                                        "shortbrief": doc[0].shortbrief,
                                        "content": doc[0].content,
                                        "createdate": doc[0].createdate,
                                        "owner": doc[0].owner,
                                        "modifydate": doc[0].modifydate,
                                        "category": doc[0].category,
                                        "link": doc[0].link,
                                        "editor": doc[0].editor,
                                        "thumbnail": doc[0].thumbnail,
                                        "status": doc[0].status,
                                        "draft": doc[0].draft,
                                        "post": doc[0].post,
                                        "order": doc[0].order
                                    }
                                }, function (err, resp, status) {
                                    db.close();
                                    res.send(result);
                                });
                            })
                        });
                    }
                )
            }
        })
    },

    /*unpush a news by id
     order: 1 => 0
     Input : id, modifydate */
    news_unpush: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var modifydate = req.body.modifydate;
                var collection = db.collection(tb);
                collection.updateOne({
                        _id: parseInt(id)
                    }, {
                        $set: {
                            order: 0,
                            modifydate: modifydate
                        }
                    }, function (err, result) {
                        client.delete({
                            index: 'bss',
                            type: tb,
                            id: id
                        }, function (err, resp, status) {
                            collection.find({_id: parseInt(id)}).toArray(function (err, doc) {
                                client.index({
                                    index: 'bss',
                                    type: tb,
                                    id: id,
                                    body: {
                                        "id": id,
                                        "title": doc[0].title,
                                        "shortbrief": doc[0].shortbrief,
                                        "content": doc[0].content,
                                        "createdate": doc[0].createdate,
                                        "owner": doc[0].owner,
                                        "modifydate": doc[0].modifydate,
                                        "category": doc[0].category,
                                        "link": doc[0].link,
                                        "editor": doc[0].editor,
                                        "thumbnail": doc[0].thumbnail,
                                        "status": doc[0].status,
                                        "draft": doc[0].draft,
                                        "post": doc[0].post,
                                        "order": doc[0].order
                                    }
                                }, function (err, resp, status) {
                                    db.close();
                                    res.send(result);
                                });
                            })
                        });
                    }
                )
            }
        })
    }

};