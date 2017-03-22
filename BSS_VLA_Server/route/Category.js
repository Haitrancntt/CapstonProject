/**
 * Created by HienNguyen on 15/03/2017.
 */
var express = require('express');
var router = express.Router();
var category = require('../controller/Category');

module.exports = router;

router.post('/select',category.category_select);

router.post('/selectbyid',category.category_selectbyid);

router.post('/selectlv1',category.category_selectlv1);

router.post('/selectlv2',category.category_selectlv2);

router.post('/createlv1',category.category_createlv1);

router.post('/createlv2',category.category_createlv2);

router.post('/editlv1',category.category_editlv1);

router.post('/editlv2',category.category_editlv2);

router.post('/deletelv1',category.category_deletelv1);

router.post('/deletelv2',category.category_deletelv2);