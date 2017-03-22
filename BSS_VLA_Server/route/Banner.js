/**
 * Created by HienNguyen on 21/03/2017.
 */
var express = require('express');
var router = express.Router();
var banner = require('../controller/Banner');

module.exports = router;

router.post('/select', banner.banner_select);

router.post('/selectbyid', banner.banner_selectbyid);

router.post('/selectshow', banner.banner_selectshow);

router.post('/create', banner.banner_create);

router.post('/delete', banner.banner_delete);

router.post('/show', banner.banner_show);

router.post('/hide', banner.banner_hide);