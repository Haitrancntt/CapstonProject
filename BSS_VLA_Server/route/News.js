/**
 * Created by HienNguyen on 17/03/2017.
 */
var express = require('express');
var router = express.Router();
var news = require('../controller/News');

module.exports = router;
//-----------User-----------
router.post('/selectcategory', news.news_selectcategory_es);

router.post('/selectdetail', news.news_selectdetail_es);

router.post('/search', news.news_search_es);

router.post('/selectrecent', news.news_selectrecent_es);

router.post('/selectrelate', news.news_selectrelate_es);
//-----------End User-----------

//-----------CMS------------
router.post('/selectrevision', news.news_selectrevisionnews);

router.post('/selectbyid', news.news_selectbyid);

router.post('/selectnews', news.news_selectnews);

router.post('/selectnewsdetail', news.news_selectnewsdetail);

router.post('/selectdraft', news.news_selectdraft);

router.post('/selectdraftdetail', news.news_selectdraftdetail);

router.post('/createdraft', news.news_createdraft);

router.post('/edit', news.news_edit);

router.post('/delete', news.news_deletedraft);

router.post('/post', news.news_post_es);

router.post('/deactive', news.news_deactive_es);

router.post('/approve', news.news_approve);

router.post('/transfer', news.news_tranfer);

router.post('/push', news.news_push);

router.post('/unpush', news.news_unpush);
//-----------End CMS------------