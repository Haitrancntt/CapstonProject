/**
 * Created by HienNguyen on 22/05/2017.
 */
var config = require('../Config');
var path = require('path');
var fs = require('fs');
var FroalaEditor = require('../lib/froalaEditor.js');
var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dbzu2ehuh',
    api_key: '854923842139159',
    api_secret: 'b3zGa-lwimwgR0HD0cZjnXWfgRk'
});

var filesDir = path.join(path.dirname(require.main.filename), 'uploads');
if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
}

module.exports =
{
    picture_upload: function (req, res) {
        FroalaEditor.Image.upload(req, '/uploads/', function (err, data) {

            if (err) {
                return res.send(JSON.stringify(err));
            }
            console.log(data);
            var string = '' + config.IPsv2 + ':3000' + data.link;
            console.log(string);
            res.send({link: string});
        });
    },
    picture_upload_heroku: function (req, res) {
        FroalaEditor.Image.upload(req, '/uploads/', function (err, data) {
            if (err) {
                return res.send(JSON.stringify(err));
            }
            var imagedir = '.' + data.link;
            cloudinary.uploader.upload(imagedir, function (result) {
                res.send({link: result.url});
            });
        });
    }
};