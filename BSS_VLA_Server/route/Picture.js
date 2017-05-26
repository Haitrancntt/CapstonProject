/**
 * Created by HienNguyen on 22/05/2017.
 */
var express = require('express');
var router = express.Router();
var picture = require('../controller/Picture');

module.exports = router;
//-----------CMS------------
router.post('/upload', picture.picture_upload);

router.post('/uploadheroku', picture.picture_upload_heroku);
