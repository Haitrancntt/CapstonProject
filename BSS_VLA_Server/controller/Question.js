/**
 * Created by HienNguyen on 08/03/2017.
 */
var MongoClient = require('mongodb').MongoClient;
var utility = require('../Utility');
var config = require('../Config');
var mongoUrl = config.mongourl;
var tb = 'tb_faq';
var es = require('elasticsearch');
var client = new es.Client({
    hosts: config.esurl
});

module.exports =
{
    /*view question by id
     * Input : id */
    question_selectbyid: function (req, res) {
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


    /*view questions don't have anwser
     * select answer null */
    question_selectnotanswer: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({
                        answer: null
                    }, null,
                    {
                        sort: {
                            question_time: -1
                        }
                    }).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    /*view questions have anwser
     * select answer != null */
    question_selectanswer: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                collection.find({
                        answer: {
                            $ne: null
                        }
                    }, null,
                    {
                        sort: {
                            answer_time: -1
                        }
                    }).toArray(function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    /*view approved questions
     * select approve : true */

    question_selectapprove_es: function (req, res) {
        client.search({
            index: 'bss',
            type: tb,
            body: {
                query: {
                    "query_string": {
                        "fields": ["question"],
                        "query": "**"
                    }
                },
                sort: {
                    "question_time": "desc"
                }
            }
        }, function (err, resp, status) {
            console.log(resp);
            res.send(resp.hits.hits);
        });
    },

    /*view question by id in elasticsearch
     * Input : id */
    question_selectbyid_es: function (req, res) {
        var id = req.body.id;
        client.get({
            index: 'bss',
            type: tb,
            id: id
        }, function (err, resp, status) {
            res.send(resp);
        });
    },

    /*search question on user
     * input : textsearch*/
    question_search_es: function (req, res) {
        var textsearch = req.body.textsearch;
        client.search({
            index: 'bss',
            type: tb,
            body: {
                query: {
                    "query_string": {
                        "fields": ["question"],
                        "query": "*" + textsearch + "*"
                    }
                }
            }
        }, function (err, resp, status) {
            res.send(resp.hits.hits);
        });
    },

    /*create a question
     * Input : question, questionperson, questiontime, email */
    question_create: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                utility.getid(tb, function (err, number) {
                    var id = number + 1;
                    var question = req.body.question;
                    var questionperson = req.body.questionperson;
                    var questiontime = req.body.questiontime;
                    var email = req.body.email;
                    var collection = db.collection(tb);
                    collection.insertOne({
                        _id: id,
                        question: question,
                        question_person: questionperson,
                        question_time: questiontime,
                        email: email,
                        approve: false
                    }, function (err, result) {
                        db.close();
                        res.send(result);
                    })
                })
            }
        })
    },

    /*anwser a question
     * Input : id, answer, answerperson, answertime */
    question_anwser: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var answer = req.body.answer;
                var answerperson = req.body.answerperson;
                var answertime = req.body.answertime;
                var collection = db.collection(tb);
                collection.updateOne({
                    _id: parseInt(id)
                }, {
                    $set: {
                        answer: answer,
                        answer_person: answerperson,
                        answer_time: answertime
                    }
                }, function (err, result) {
                    collection.find({
                        _id: parseInt(id)
                    }).toArray(function (err, doc) {
                        console.log(doc);
                        utility.sendemailquestion(doc[0].email, doc[0].question, doc[0].question_person, doc[0].answer, doc[0].answer_person);
                        db.close();
                        res.send(result);
                    })
                })
            }
        })
    },

    /*edit a question
     * Input : id, question , answer */
    question_edit: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var id = req.body.id;
                var question = req.body.question;
                var answer = req.body.answer;
                var collection = db.collection(tb);
                collection.updateOne({
                    _id: parseInt(id)
                }, {
                    $set: {
                        question: question,
                        answer: answer
                    }
                }, function (err, result) {
                    db.close();
                    res.send(result);
                })
            }
        })
    },

    /*approve a question
     aprrove false => true
     Input : id */
    question_approve_es: function (req, res) {
        MongoClient.connect(mongoUrl, function (err, db) {
            if (err)  console.log('Unable to connect to the mongoDB server. Error:', err);
            else {
                var collection = db.collection(tb);
                var id = req.body.id;
                collection.updateOne({
                    _id: parseInt(id)
                }, {
                    $set: {
                        approve: true
                    }
                }, function (err, result) {
                    collection.find({_id: parseInt(id)}).toArray(function (err, doc) {
                        client.index({
                            index: 'bss',
                            type: tb,
                            id: id,
                            body: {
                                "id": id,
                                "question": doc[0].question,
                                "answer": doc[0].answer,
                                "answer_person": doc[0].answer_person,
                                "question_time": doc[0].question_time
                            }
                        }, function (err, resp, status) {
                            db.close();
                            res.send(result);
                        });
                    })
                })
            }
        })
    }
};