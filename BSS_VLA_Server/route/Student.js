/**
 * Created by HienNguyen on 15/03/2017.
 */
var express = require('express');
var router = express.Router();
var  student = require('../controller/Student');

module.exports = router;

router.post('/select', student.student_select);

router.post('/selectone', student.student_selectone);

router.post('/selectbyyear', student.student_selectbyyear);

router.post('/create', student.student_create);