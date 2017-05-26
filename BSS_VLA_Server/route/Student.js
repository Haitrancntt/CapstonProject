/**
 * Created by HienNguyen on 15/03/2017.
 */
var express = require('express');
var router = express.Router();
var student = require('../controller/Student');

module.exports = router;
//-----------User-----------
router.post('/selectone', student.student_selectone);
//-----------End User-------

//-----------CMS------------
router.post('/select', student.student_select);

router.post('/selectbyyear', student.student_selectbyyear);

router.post('/import', student.student_import);
//-----------End CMS------------