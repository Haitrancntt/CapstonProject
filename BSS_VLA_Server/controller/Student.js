/**
 * Created by HienNguyen on 08/03/2017.
 */
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/db_bss_vla';
var tb = 'tb_student';

module.exports =
{
    student_select: function (req, res) {
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

    student_selectone: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({
                    $or: [
                        {idcode: req.body.code},
                        {identitycard: req.body.code}
                    ]
                }).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    student_selectbyyear: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({year: req.body.year}).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    student_create: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.insertOne({
                    idcode: req.body.idcode,
                    fullname: req.body.fullname,
                    identitycard: req.body.identitycard,
                    block: req.body.block,
                    subject1: req.body.subject1,
                    subject2: req.body.subject2,
                    subject3: req.body.subject3,
                    total: req.body.total,
                    department: req.body.department,
                    year: req.body.year
                }, function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    }
};
