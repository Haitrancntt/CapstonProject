/**
 * Created by HienNguyen on 06/03/2017.
 */
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/db_bss_vla';
var tb = 'tb_account';
var nodemailer = require('nodemailer');

module.exports =
{
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

    account_selectactive: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({statusactive: true}).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    account_selectdeactive: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({statusactive: false}).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    account_selectbyid: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({_id: parseInt(req.body.id)}).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    account_create: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                getid(function (err, result) {
                    var id = result + 1;
                    var password = generatepassword();
                    var email = req.body.email;
                    var collection = db.collection(tb);
                    collection.insertOne({
                        _id: id,
                        fullname: req.body.fullname,
                        email: req.body.email,
                        password: password,
                        statusactive: true
                    }, function (err, result) {
                        db.close();
                        sendemail(email, password);
                        res.send(result);
                    })
                })
            }
        })
    },

    account_edit: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.updateOne({_id: parseInt(req.body.id)}, {
                    $set: {
                        fullname: req.body.fullname,
                        email: req.body.email
                    }
                }, function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    account_deactive: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.updateOne({_id: parseInt(req.body.id)}, {$set: {statusactive: false}}, function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    account_active: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.updateOne({_id: parseInt(req.body.id)}, {$set: {statusactive: true}}, function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    account_changepassword: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.updateOne({_id: parseInt(req.body.id)}, {
                    $set: {
                        password: req.params.newpassword
                    }
                }, function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    account_restorepassword: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var restorepassword = generatepassword();
                var collection = db.collection(tb);
                collection.updateOne({email: req.body.email}, {
                    $set: {
                        restorepassword: restorepassword
                    }
                }, function (err, result) {
                    sendemail(req.body.email, restorepassword);
                    res.send(result);
                    db.close();
                })
            }
        })
    },

    account_authorize: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.updateOne({_id: parseInt(req.body.id)}, {
                    $set: {
                        type: req.body.newtype
                    }
                }, function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    account_login: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({
                    $or: [{email: req.body.email, password: req.body.password}, {
                        email: req.body.email,
                        restorepassword: req.body.password
                    }]
                }).toArray(function (err, result) {
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

var generatepassword = function () {
    var arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
    var pass = '';
    var len = arr.length;
    for (var i = 0; i <= 10; i++) {
        var n = Math.floor(Math.random() * len);
        pass = pass + arr[n];
    }
    return pass;
};

var sendemail = function (email, pass) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hiennguyenthai93@gmail.com',
            pass: 'hellohien'
        }
    });
    let mailOptions = {
        from: '"Van Lang University" <hiennguyenthai93@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Chao ban da toi Van Lang University', // Subject line
        text: 'Welcome', // plain text body
        html: '<b>Mat khau cua ban la ' + pass + '</b>' // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
};