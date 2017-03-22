/**
 * Created by HienNguyen on 21/03/2017.
 */
var express = require('express');
var router = express.Router();
var popup = require('../controller/Popup');

module.exports = router;

router.post('/select', popup.popup_select);

router.post('/selectbyid', popup.popup_selectbyid);

router.post('/selectshow', popup.popup_selectshow);

router.post('/create', popup.popup_create);

router.post('/edit', popup.popup_edit);

router.post('/delete', popup.popup_delete);

router.post('/show', popup.popup_show);

router.post('/hide', popup.popup_hide);