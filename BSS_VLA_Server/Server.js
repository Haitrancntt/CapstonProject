/**
 * Created by HienNguyen on 02/03/2017.
 */
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var accountRouter = require('./route/Account');
var categoryRouter = require('./route/Category');
var questionRouter = require('./route/Question');
var studentRouter = require('./route/Student');
var newsRouter = require('./route/News');
var bannerRouter = require('./route/Banner');
var pictureRouter = require('./route/Picture');

app.use(express.static(__dirname + '/'));
app.use('/bower_components', express.static(path.join(__dirname, '../bower_components')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// parse application/json
app.use(bodyParser.json({limit: '50mb'}));

// Add headers
app.all('*', function (req, res, next) {

    var allowedOrigins = ['http://192.168.137.1:3000', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:4200', 'http://localhost:3002'];
    var origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // Website you wish to allow to connect
    //res.header('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.header('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//Listen port 3000
app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!')
});

app.get('/', function (req, res) {
    res.send('<h1>Welcome</h1>');
});

app.use('/account', accountRouter);

app.use('/category', categoryRouter);

app.use('/question', questionRouter);

app.use('/student', studentRouter);

app.use('/news', newsRouter);

app.use('/banner', bannerRouter);

app.use('/picture', pictureRouter);