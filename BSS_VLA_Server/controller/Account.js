/**
 * Created by HienNguyen on 06/03/2017.
 */
var MongoClient = require('mongodb').MongoClient;
var utility = require('../Utility');
var config = require('../Config');
var mongoUrl = config.mongourl;
var tb = 'tb_account';

module.exports =
{
    /*select all accounts on database*/
    account_select: function (req, res) {
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

    /*select active accounts on database
     * select statusactive : true */
    account_selectactive: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({
                    $or: [{
                        type: 'Editor',
                        statusactive: true
                    }, {
                        type: 'Education Staff',
                        statusactive: true
                    }]
                }).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    /*select an accounts by _id on database
     * Input: id */
    account_selectbyid: function (req, res) {
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

    /*create a new account on database
     password auto generate
     Input: email, fullname, phone */
    account_create: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                utility.getid(tb, function (err, number) {
                    var id = number + 1;
                    var fullname = req.body.fullname;
                    var email = req.body.email;
                    var phone = req.body.phone;
                    var password = utility.generatepassword();
                    var collection = db.collection(tb);
                    collection.find({
                        email: email
                    }).toArray(function (err, result) {
                        if (result.length != 0) {
                            db.close();
                            res.json({result: true});
                        } else {
                            collection.insertOne({
                                _id: id,
                                fullname: fullname,
                                email: email,
                                phone: phone,
                                password: password,
                                statusactive: true
                            }, function (err, result) {
                                db.close();
                                utility.sendemailaccount(email, password);
                                res.json({result: false});
                            })
                        }
                    })
                })
            }
        })
    },

    /*edit an account by _id on database
     edit fullname and phone
     Input: id, fullname, phone */
    account_edit: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
                if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
                else {
                    var id = req.body.id;
                    var fullname = req.body.fullname;
                    var phone = req.body.phone;
                    var collection = db.collection(tb);
                    collection.updateOne({
                        _id: parseInt(id)
                    }, {
                        $set: {
                            fullname: fullname,
                            phone: phone
                        }
                    }, function (err, result) {
                        db.close();
                        res.send(result);
                    })
                }
            }
        )
    },

    /*deactive an account by _id
     statusactive true => false
     Input : id */
    account_deactive: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var collection = db.collection(tb);
                collection.updateOne({
                    _id: parseInt(id)
                }, {
                    $set: {
                        statusactive: false
                    }
                }, function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    /*active an account by _id
     statusactive false => true
     Input : id */
    account_active: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var collection = db.collection(tb);
                collection.updateOne({
                    _id: parseInt(id)
                }, {
                    $set: {
                        statusactive: true
                    }
                }, function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    /*change password an account by _id on database
     * Input : id, newpassword */
    account_changepassword: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var newpassword = req.body.newpassword;
                var collection = db.collection(tb);
                collection.updateOne({
                    _id: parseInt(id)
                }, {
                    $set: {
                        password: newpassword
                    }
                }, function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    /*restore a new password for account on database
     restore password auto generate
     Input : email */
    account_restorepassword: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var restorepassword = utility.generatepassword();
                var email = req.body.email;
                var collection = db.collection(tb);
                collection.find({
                    email: email
                }).toArray(function (err, result) {
                    if (result.length != 0) {
                        collection.updateOne({
                            email: email
                        }, {
                            $set: {
                                restorepassword: restorepassword
                            }
                        }, function (err, result) {
                            db.close();
                            utility.sendemailaccount(email, restorepassword);
                            res.json({result: true});
                        });
                    } else {
                        db.close();
                        res.json({result: false});
                    }
                })
            }
        })
    },

    /*change type an account by _id on database
     * Input : id, newtype */
    account_authorize: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var newtype = req.body.newtype;
                var collection = db.collection(tb);
                collection.updateOne({
                    _id: parseInt(id)
                }, {
                    $set: {
                        type: newtype
                    }
                }, function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    /*login
     * Input : email, password */
    account_login: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var email = req.body.email;
                var password = req.body.password;
                var collection = db.collection(tb);
                collection.find({
                    $or: [{
                        email: email,
                        password: password,
                        statusactive: true
                    }, {
                        email: email,
                        restorepassword: password,
                        statusactive: true
                    }]
                }).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },
};