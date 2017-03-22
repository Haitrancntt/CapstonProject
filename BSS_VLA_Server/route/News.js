/**
 * Created by HienNguyen on 17/03/2017.
 */
var express = require('express');
var router = express.Router();
var news = require('../controller/News');

module.exports = router;

router.post('/select', news.news_select);

router.post('/selectusercategory', news.news_user_selectcategory);

router.post('/selectuserdetail', news.news_user_selectdetail);

router.post('/selectuserrecent', news.news_user_selectrecent);

router.post('/selectuserrelate', news.news_user_selectrelate);

router.post('/selectadminnews', news.news_admin_selectnews);

router.post('/selectadmindraft', news.news_admin_selectdraft);

router.post('/selecteditordraft', news.news_editor_selectdraft);

router.post('/createdraft', news.news_createdraft);

router.post('/edit', news.news_edit);

router.post('/delete', news.news_deletedraft);

router.post('/post', news.news_post);

router.post('/deactive', news.news_deactive);

router.post('/approve', news.news_approve);

router.post('/tranferadmin', news.news_admin_tranfer);

router.post('/approveaditor', news.news_editor_tranfer);