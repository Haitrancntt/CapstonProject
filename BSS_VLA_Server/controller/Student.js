/**
 * Created by HienNguyen on 08/03/2017.
 */
var MongoClient = require('mongodb').MongoClient;
var utility = require('../Utility');
var config = require('../Config');
var mongoUrl = config.mongourl;
var tb = 'tb_student';
var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');

module.exports =
{
    /*list all student*/
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
    /*view student by sbd or cmnd
     * Input : code */
    student_selectone: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var code = req.body.code;
                var collection = db.collection(tb);
                collection.find({
                    $or: [{
                        sbd: code
                    }, {
                        cmnd: code
                    }]
                }).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    /*view student by year
     * Input : year */
    student_selectbyyear: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var year = req.body.year;
                var collection = db.collection(tb);
                collection.find({
                    nam: year
                }).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    /*
     Input : file excel
     sbd, ho_ten, cmnd, khoi, mon_1, mon_2, mon_3, tong_diem, nganh, nam
     */
    student_import: function (req, res) {
        var exceltojson;
        upload(req, res, function (err) {
            if (err) {
                console.log('loi up file');
                res.json({error_code: 1, err_desc: err});
                return;
            }
            /** Multer gives us file info in req.file object */
            if (!req.file) {
                console.log('file khong ton tai');
                res.json({error_code: 1, err_desc: "No file passed"});
                return;
            }
            /** Check the extension of the incoming file and
             *  use the appropriate module
             */
            if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    lowerCaseHeaders: true
                }, function (err, result) {
                    if (err) {
                        console.log('loi doc file');
                        return res.json({error_code: 1, err_desc: err, data: null});
                    }
                    MongoClient.connect(mongoUrl, function (err, db) {
                        if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
                        else {
                            var collection = db.collection(tb);
                            collection.insertMany(result, function (err, doc) {
                                db.close();
                                console.log('ok');
                                res.send(doc);
                            });
                        }
                    })

                });
            } catch (e) {
                res.json({error_code: 1, err_desc: "Corupted excel file"});
            }
        })
    }
};
