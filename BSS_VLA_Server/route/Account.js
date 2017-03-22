/**
 * Created by HienNguyen on 14/03/2017.
 */
var express = require('express');
var router = express.Router();
var account = require('../controller/Account');

module.exports = router;

router.post('/select', account.account_select);

router.post('/selectbyid', account.account_selectbyid);

router.post('/selectactive', account.account_selectactive);

router.post('/selectdeactive', account.account_selectdeactive);

router.post('/create', account.account_create);

router.post('/edit', account.account_edit);

router.post('/deactive', account.account_deactive);

router.post('/active', account.account_active);

router.post('/changepassword', account.account_changepassword);

router.post('/restorepassword', account.account_restorepassword);

router.post('/authorize', account.account_authorize);

router.post('/login', account.account_login);