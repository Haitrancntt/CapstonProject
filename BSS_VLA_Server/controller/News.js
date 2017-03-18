/**
 * Created by HienNguyen on 02/03/2017.
 */
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/db_bss_vla';
var tb = 'tb_news';
module.exports =
{
    //************Select all news*****************
    news_select: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({status: 1}).toArray(function (err, result) {
                    cb(err, result);
                    db.close;
                })
            }
        })
    },

    /*select news by category
     **/
    news_selecttbycategory: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)console.log('Unable to connect to MongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({category: category}, {status: 1}, {draft: 0}).toArray(function (err, result) {
                    cb(err, result);
                    db.close;
                })
            }
        })
    },

    /*select one news with _id
     **/
    news_one: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({_id: id}, {status: 1}).toArray(function (err, result) {
                    cb(err, result);
                    db.close;
                })
            }
        })
    },

    /*select news
     * select news by owner
     **/
    news_selectbyowner: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server.Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({owner: owner}, {status: 1}).toArray(function (err, result) {
                    cb(err, result);
                    db.close;
                })
            }
        })
    },

    /*create news
     * with status:1
     * draft:1
     * */
    news_create: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.insertOne({
                    _id: id,
                    title: title,
                    shortbrief: des,
                    content: content,
                    owner: owner,
                    draft: 1,
                    link_image: link,
                    create_day: create_day,
                    status: 1,
                    category: category
                }, function (err, result) {
                    cb(err, result)
                    db.close
                })
            }
        })
    },

    /*Edit news
     * just edit news have draft:1
     * */
    news_editbyid: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.update({_id: id}, {
                    $set: {
                        title: title,
                        shortbrief: des,
                        content: content,
                        owner: owner,
                        link_image: link,
                        create_day: create_day,
                        category: category
                    }
                }, function (err, result) {
                    cb(err, result);
                    db.close;
                })
            }
        })
    },

    /*select draft or news
     * draft => draft :1
     * news => draft :0
     * */
    news_selectdraft: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({draft: draft}, {status: 1}).toArray(function (err, result) {
                    cb(err, result);
                    db.close;
                })
            }
        })
    },

    /*post news
     * change draft 1 =>0
     * */
    news_postnews: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.updateOne({_id: id}, {
                    $set: {
                        draft: 0,
                        post_time: posttime
                    }
                }, function (err, result) {
                    cb(err, result);
                    db.close;
                })
            }
        })
    },

    /*deactivate news
     * change status 1 => 0
     * */
    news_deactivate: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.updateOne({_id: id}, {
                    $set: {
                        draft: 1
                    }
                }, function (err, result) {
                    cb(err, result);
                    db.close;
                })
            }
        })
    },

    /*activate news
     * change status 0 =>1
     * */
    news_activate: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.updateOne({_id: id}, {
                    $set: {
                        status: 1
                    }
                }, function (err, result) {
                    cb(err, result);
                    db.close;
                })
            }
        })
    },

    /*transfer news
     * change name of owner
     **/
    news_transfer: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.updateOne({_id: id}, {
                    $set: {
                        owner: owner
                    }
                }, function (err, result) {
                    cb(err, result);
                    db.close;

                })
            }
        })
    },

    /*delete draft
     * change status 1 => 0
     **/
    news_deletedraft: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)console.log('Unable to connect to MongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.updateOne({_id: id}, {
                    $set: {
                        status: 0
                    }
                }, function (err, result) {
                    cb(err, result);
                    db.close;
                })
            }
        })
    }

};

