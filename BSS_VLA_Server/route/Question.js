/**
 * Created by HienNguyen on 15/03/2017.
 */
var express = require('express');
var router = express.Router();
var question = require('../controller/Question');

module.exports = router;

router.post('/select',question.question_select);

router.post('/selectbyid',question.question_selectbyid);

router.post('/selectanswer',question.question_selectanswer);

router.post('/selectnoanswer',question.question_selectnotanswer);

router.post('/selectapprove',question.question_selectapprove);

router.post('/create',question.question_create);

router.post('/answer',question.question_anwser);

router.post('/approve',question.question_approve);