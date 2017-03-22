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
var popupRouter = require('./route/Popup');
var bannerRouter = require('./route/Banner');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

app.get('/', function (req, res) {
    res.send('hello');
});

app.use('/account', accountRouter);

app.use('/category', categoryRouter);

app.use('/question', questionRouter);

app.use('/student', studentRouter);

app.use('/news', newsRouter);

app.use('/popup', popupRouter);

app.use('/banner', bannerRouter);