/**
 * Created by HienNguyen on 15/03/2017.
 */
var express = require('express');
var router = express.Router();
var question = require('../controller/Question');

module.exports = router;
//-----------User-----------
router.post('/selectbyides', question.question_selectbyid_es);

router.post('/selectapprove', question.question_selectapprove_es);

router.post('/search', question.question_search_es);

router.post('/create', question.question_create);
//-----------End User-----------

//-----------CMS------------
router.post('/selectbyid', question.question_selectbyid);

router.post('/selectanswer', question.question_selectanswer);

router.post('/selectnoanswer', question.question_selectnotanswer);

router.post('/answer', question.question_anwser);

router.post('/edit', question.question_edit);

router.post('/approve', question.question_approve_es);
//-----------End CMS------------