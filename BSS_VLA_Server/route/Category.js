/**
 * Created by HienNguyen on 15/03/2017.
 */
var express = require('express');
var router = express.Router();
var category = require('../controller/Category');

module.exports = router;
//-----------User-----------
router.post('/select', category.category_select_redis);

router.post('/selectbylink', category.category_selectbylink);
//-----------End User-----------

//-----------CMS------------
router.post('/selectlv1', category.category_selectlv1);

router.post('/selectlv2', category.category_selectlv2);

router.post('/createlv1', category.category_createlv1_redis);

router.post('/createlv2', category.category_createlv2_redis);

router.post('/editlv1', category.category_editlv1_redis);

router.post('/editlv2', category.category_editlv2_redis);

router.post('/deletelv1', category.category_deletelv1_redis);

router.post('/deletelv2', category.category_deletelv2_redis);
//-----------End CMS------------