/**
 * Created by HienNguyen on 28/03/2017.
 */
var nodemailer = require('nodemailer');
var config = require('./Config');
var user = config.user;
var password = config.pass;
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = config.mongourl;

module.exports = {
    getnumber_position: function (tb, position, cb) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({position: position}).count(function (err, result) {
                    db.close();
                    cb(err, result);
                })
            }
        })
    },

    getid: function (tb, cb) {
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
    },

    getidlv2: function (id, tb, cb) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err) console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({_id: id}).toArray(function (err, result) {
                    db.close();
                    cb(err, result)
                })
            }
        })
    },

    generatepassword: function () {
        var arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
        var pass = '';
        var len = arr.length;
        for (var i = 0; i <= 10; i++) {
            var n = Math.floor(Math.random() * len);
            pass = pass + arr[n];
        }
        return pass;
    },

    sendemailaccount: function (email, pass) {
        let transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: '587',
            auth: {user: user, pass: password},
            secureConnection: false,
            tls: {ciphers: 'SSLv3'}
        });
        let mailOptions = {
            from: '"Van Lang University" <' + user + '>', // sender address
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
    },

    sendemailquestion: function (email, question, questionperson, answer, answerperson) {
        let transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: '587',
            auth: {user: user, pass: password},
            secureConnection: false,
            tls: {ciphers: 'SSLv3'}
        });
        let mailOptions = {
            from: '"Van Lang University" <' + user + '>', // sender address
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
    },

    unsign: function (str) {
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        return str;
    },

    ignoreSpaces: function (strg) {
        var temp = "";
        strg = '' + strg;
        var splitstring = strg.split(" ");
        for (var i = 0; i < splitstring.length; i++)
            temp += splitstring[i];
        return temp;
    },
};