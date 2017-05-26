/**
 * Created by HienNguyen on 21/03/2017.
 */
var express = require('express');
var router = express.Router();
var banner = require('../controller/Banner');

module.exports = router;
//-----------User-----------
router.post('/selectposition1', banner.banner_selectposition1user_redis);

router.post('/selectposition2', banner.banner_selectposition2user_redis);
//-----------End User-----------

//-----------CMS------------
router.post('/select', banner.banner_select);

router.post('/selectposition', banner.banner_selectposition);

router.post('/selectbyid', banner.banner_selectbyid);

router.post('/create', banner.banner_create_redis);

router.post('/edit', banner.banner_edit_redis);

router.post('/delete', banner.banner_delete_redis);

router.post('/show', banner.banner_show_redis);

router.post('/hide', banner.banner_hide_redis);

router.post('/order', banner.banner_order_redis);
//-----------End CMS------------