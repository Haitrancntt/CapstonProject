/**
 * Created by HienNguyen on 09/05/2017.
 */
var IPserver1 = 'localhost'; //Input IP server 1
var IPserver2 = 'localhost'; //Input IP server 1
var Email = 'haitran11@vanlanguni.vn'; //Input Email
var Password = 'Novu7713'; // Input Password


module.exports = {
    //mail account
    //user
    'user': Email,
    //pass
    'pass': Password,

    'IPsv2' : IPserver2,

/*    //Local
    // mongodb url localhost
     'mongourl': 'mongodb://localhost:27017/db_bss_vla',

     // redis url localhost
     'redisport': '6379',
     'redisurl':IPserver1,

     //elasticsearch url localhost
     'esurl' : IPserver1+':9200',*/

    //Cloud
    // mongodb url mlab
    'mongourl': 'mongodb://hien:hien1234@ds143340.mlab.com:43340/testapp',

    // redis url redislab
    'redisport': '18172',
    'redisurl': 'redis-18172.c10.us-east-1-2.ec2.cloud.redislabs.com',

    //elasticsearch url
    'esurl': 'https://zr1goqpi7h:fjyzchnbnh@first-cluster-6485307223.ap-southeast-2.bonsaisearch.net',

};