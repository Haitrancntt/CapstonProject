/**
 * Created by HienNguyen on 02/03/2017.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var accountRouter = require('./route/Account');
var categoryRouter = require('./route/Category');
var questionRouter = require('./route/Question');
var studentRouter = require('./route/Student');
var newsRouter = require('./route/News');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

app.get('/', function (req, res) {
    res.send('hello');
});

app.use('/account', accountRouter);

app.use('/category',categoryRouter);

app.use('/question', questionRouter);

app.use('/student', studentRouter);

app.use('/news', newsRouter);

// ********************Category************
/*
// Select all categories
app.get('/category', function (req, res) {
    category.category_select(function (err, result) {
        res.send(result)
    })
});
// Select one category by id
app.get('/category/:id', function (req, res) {
    var id = parseInt(req.params.id);
    category.category_selectbyid(id, function (err, result) {
        res.send(result)
    })
});
/!*!// Select all categories
 app.get('/category/level/:id', function (req, res) {
 var id = parseInt(req.params.id);
 category.category_selectbylevel(id, function (err, result) {
 res.send(result)
 })
 });*!/
//delete categories
app.get('/category/delete/:id', function (req, res) {
    var id = parseInt(req.params.id);
    category.category_deletebyid(id, function (err, result) {
        res.send(result)
    })
});
//create categories
app.get('/category/create/:name/:link/:level', function (req, res) {
    var name = req.params.name;
    var link = req.params.link;
    var level = parseInt(req.params.level);
    category.category_create(name, link, level, function (err, result) {
        res.send(result)
    })
});
//edit categories
app.get('/category/edit/:id/:name/:link/:level', function (req, res) {
    var id = parseInt(req.params.id);
    var name = req.params.name;
    var link = req.params.link;
    var level = parseInt(req.params.level);
    category.category_editbyid(id, name, link, level, function (err, result) {
        res.send(result)
    })
});
//!**************End category***********************
*/

//****************Start News********************************
/*

/!*
 * get all news
 **!/
app.get('/news', function (req, res) {
    news.news_select(function (err, result) {
        res.send(result)
    })
});
/!*get news by id
 **!/
app.get('/news/:id', function (req, res) {
    var id = parseInt(req.params.id);
    news.news_one(id, function (err, result) {
        res.send(result)
    })
});

/!*get news by category
 **!/
app.get('/news/getbycategory/:category', function (req, res) {
    var category = parseInt(req.params.category);
    news.news_selecttbycategory(category, function (err, result) {
        res.send(result);
    })
});

/!*create news
 **!/
app.get('/news/create/:id/:title/:des/:content/:owner/:link/:createday/:category', function (req, res) {
    var id = parseInt(req.params.id);
    var title = req.params.title;
    var description = req.params.des;
    var content = req.params.content;
    var owner = req.params.owner;
    var link = req.params.link;
    var createday = req.params.createday;
    var cate = parseInt(req.params.category);
    news.news_create(id, title, description, content, owner, link, createday, cate,
        function (err, result) {
            res.send(result)
        })
});

/!*edit news
 **!/
app.get('/news/edit/:id/:title/:des/:content/:owner/:link/:createday/:category', function (req, res) {
    var id = parseInt(req.params.id);
    var title = req.params.title;
    var description = req.params.des;
    var content = req.params.content;
    var owner = req.params.owner;
    var link = req.params.link;
    var createday = req.params.createday;
    var cate = parseInt(req.params.category);
    category.news_editbyid(id, title, description, content, owner, link, createday, cate, function (err, result) {
        res.send(result)
    })
});

/!*select draft or news
 * draft => draft =1
 * news => draft =0
 * *!/
app.get('/news/:draft', function (req, res) {
    var draft = parseInt(req.params.draft);
    news.news_selectdraft(draft, function (err, result) {
        res.send(result);
    })
});

/!*post news
 * change draft 1 =>0
 * *!/
app.get('/news/postnews/:id/:posttime', function (req, res) {
    var id = parseInt(req.params.id);
    var posttime = req.params.posttime;
    news.news_postnews(id, posttime, function (err, result) {
        res.send(result);
    })
})

/!*
 * deactivate news
 * change status  1 => 0
 * *!/
app.get('/news/deactivate/:id', function (req, res) {
    var id = parseInt(req.params.id);
    news.news_deactivate(id, function (err, result) {
        res.send(result);
    })
})

/!*transfer news
 * change name of owner
 * *!/
app.get('/news/transfer/:id/:owner', function (req, res) {
    var id = parseInt(req.params.id);
    var owner = req.params.owner;
    news.news_transfer(id, owner, function (err, result) {
        res.send(result);
    })
})

/!*activate news
 * change status 0 => 1
 * *!/
app.get('news/activate/:id', function (req, res) {
    var id = parseInt(req.params.id);
    news.news_activate(id, function (err, result) {
        res.send(result);
    })
})

/!*delete news
 *change status 1 => 0
 **!/
app.get('news/delete/:id', function (req, res) {
    var id = parseInt(req.params.id);
    news.news_deletedraft(id, function (err, result) {
        res.send(result);
    })
})

/!*get news for owner
 **!/
app.get('news/newsbyowner/:owner', function (req, res) {
    var owner = req.params.owner;
    news.news_selectbyowner(owner, function (err, result) {
        res.send(result);
    })
})

//!*****************End News**************************************
*/

 //!*******************Start account*********************
/*
 //select all accounts

 //select activated account
 app.get('/account/active', function (req, res) {
 account.account_selectactive(function (err, result) {
 res.send(result)
 })
 });
 //select deactivate account
 app.get('/account/deactive', function (req, res) {
 account.account_selectdeactive(function (err, result) {
 res.send(result)
 })
 });
 // select account by id
 app.get('/account/:id', function (req, res) {
 var id = parseInt(req.params.id);
 account.account_selectbyid(id, function (err, result) {
 res.send(result)
 })
 });
 //deactive account
 app.get('/account/deactive/:id', function (req, res) {
 var id = parseInt(req.params.id);
 account.account_deactive(id, function (err, result) {
 res.send(result)
 })
 });
 //active account
 app.get('/account/active/:id', function (req, res) {
 var id = parseInt(req.params.id);
 account.account_active(id, function (err, result) {
 res.send(result)
 })
 });
 //login
 app.get('/account/login/:user/:password', function (req, res) {
 var user = req.params.user;
 var password = req.params.password;
 account.account_login(user, password, function (err, result) {
 res.send(result)
 })
 });
 //change password
 app.get('/account/password/:id/:password', function (req, res) {
 var id = parseInt(req.params.id);
 var password = req.params.password;
 account.account_changepassword(id, password, function (err, result) {
 res.send(result)
 })
 });
 //authorize account
 app.get('/account/authorize/:id/:type', function (req, res) {
 var id = parseInt(req.params.id);
 var type = req.params.type;
 account.account_authorize(id, type, function (err, result) {
 res.send(result)
 })
 });
 //edit account
 app.get('/account/edit/:id/:fullname/:email', function (req, res) {
 var id = parseInt(req.params.id);
 var fullname = req.params.fullname;
 var email = req.params.email;
 account.account_edit(id, fullname, email, function (err, result) {
 res.send(result)
 })
 });
 //create accout
 app.get('/account/create/:fullname/:email/:password/:type', function (req, res) {
 var fullname = req.params.fullname;
 var email = req.params.email;
 var password = req.params.password;
 var type = req.params.type;
 account.account_create(fullname, email, password, type, function (err, result) {
 res.send(result)
 })
 });
 //restore password
 app.get('/account/restore/:email', function (req, res) {
 var email = req.params.email;
 account.account_restorepassword(email, function (err, result) {
 res.send(result)
 })
 });
 // search account
 app.get('/account/search/:textsearch', function (req, res) {
 var textsearch = req.params.textsearch;
 account.account_search(textsearch, function (err, result) {
 res.send(result)
 })
 });
 //!*****************End Account**************************************
 */

//!*******************Start Question*********************
/*
//select all questions
app.get('/question', function (req, res) {
    question.question_select(function (err, result) {
        res.send(result);
    })
});
//select a question
app.get('/question/:id', function (req, res) {
    var id = parseInt(req.params.id);
    question.question_selectbyid(id, function (err, result) {
        res.send(result);
    })
});
//select questions (answer = null)
app.get('/question/answer', function (req, res) {
    question.question_selectanswer(function (err, result) {
        res.send(result);
    })
});
//select questions (answer != null)
app.get('/question/noanswer', function (req, res) {
    question.question_selectnotanswer(function (err, result) {
        res.send(result);
    })
});
//select approve question
app.get('/question/approve', function (req, res) {
    question.question_selectapprove(function (err, result) {
        res.send(result);
    })
});
//create question
app.get('/question/create/:question/:questionperson/:questiontime/:email', function (req, res) {
    var questions = req.params.question;
    var questionperson = req.params.questionperson;
    var questiontime = req.params.questiontime;
    var email = req.params.email;
    question.question_create(questions, questionperson, questiontime, email, function (err, result) {
        res.send(result);
    })
});
//answer question
app.get('/question/answer/:id/:answer/:answerperson/:answertime', function (req, res) {
    var id = parseInt(req.params.id);
    var answer = req.params.answer;
    var answerperson = req.params.answerperson;
    var answertime = req.params.answertime;
    question.question_anwser(id, answer, answerperson, answertime, function (err, result) {
        res.send(result);
    })
});
//approve question
app.get('/question/approve/:id', function (req, res) {
    var id = parseInt(req.params.id);
    question.question_approve(id, function (err, result) {
        res.send(result);
    })
});
//!*****************End Question**************************************
*/

//*******************Start student*********************
/*
//select all student
app.get('/student', function (req, res) {
    student.student_select(function (err, result) {
        res.send(result);
    })
});
//select student by year
app.get('/student/year/:year', function (req, res) {
    var year = req.params.year;
    student.student_selectbyyear(year, function (err, result) {
        res.send(result);
    })
});
//select by code
app.get('/student/:code', function (req, res) {
    var code = req.params.code;
    student.student_selectone(code, function (err, result) {
        res.send(result);
    })
});
//create student
app.get('/student/create/:idcode/:fulname/:indentitycard/:block/:subject1/:subject2/:subject3/:total/:department/:year', function (req, res) {
    var idcode = req.params.idcode;
    var fulname = req.params.fulname;
    var indentitycard = req.params.indentitycard;
    var block = req.params.block;
    var subject1 = req.params.subject1;
    var subject2 = req.params.subject2;
    var subject3 = req.params.subject3;
    var total = req.params.total;
    var department = req.params.department;
    var year = req.params.year;

    student.student_create(idcode, fulname, indentitycard, block, subject1, subject2, subject3, total, department, year, function (err, result) {
        res.send(result);
    })
});
//!*****************End Student**************************************
*/
