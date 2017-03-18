/**
 * Created by HienNguyen on 08/03/2017.
 */
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/db_bss_vla';
var tb = 'tb_faq';
var nodemailer = require('nodemailer');

module.exports =
{
    question_select: function (req, res) {
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

    question_selectbyid: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({_id: req.body.id}).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    question_selectnotanswer: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({answer: null}).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    question_selectanswer: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({answer: !null}).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    question_selectapprove: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({approve: true}).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    question_create: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                getid(function (err, result) {
                    var id = result + 1;
                    var collection = db.collection(tb);
                    collection.insertOne({
                        _id: id,
                        question: req.body.question,
                        questionowner: req.body.questionperson,
                        questiontime: req.body.questiontime,
                        email: req.body.email,
                        approve: false
                    }, function (err, result) {
                        db.close();
                        res.send(result);
                    })
                })
            }
        })
    },

    question_anwser: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.updateOne({id: req.body.id}, {
                    $set: {
                        answer: req.body.answer,
                        answerperson: req.body.answerperson,
                        answertime: req.body.answertime
                    }
                }, function (err, result) {
                    collection.find({_id: req.body.id}).toArray(function (err, doc) {
                        sendemail(doc[0].email, doc[0].question, doc[0].questionperson, doc[0].answer, doc[0].answerperson)
                        db.close();
                        res.send(result);
                    })
                })
            }
        })
    },

    question_approve: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.updateOne({id: req.body.id}, {
                    $set: {
                        approve: true
                    }
                }, function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

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

var sendemail = function (email, question, questionperson, answer, answerperson) {
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
        subject: 'Tra loi cau hoi', // Subject line
        text: 'Welcome', // plain text body
        html: '<h1>Chao ban ' + questionperson + '</h1>' +
        '<b>Cau hoi cua ban:</b>' +
        '<p>' + question + '</p>' +
        '<br>' +
        '<b>Tra loi</b>' +
        '<p>' + answer + '</p>' +
        '<b>' + answerperson + '</b>' // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
};