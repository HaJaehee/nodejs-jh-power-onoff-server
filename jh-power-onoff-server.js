/*
 *jh-power-onoff-server.js 
 *Created by HJH on 2015-06-08 at 20:41
 */

var mysql = require('mysql');
// load mysql module
var http = require('http');
var http2 = require('http');
var qs = require('querystring');
// load querystring module
var url = require('url');
// load url module
var querystring = require('querystring');

var device_ip = '127.0.0.1';
var device_power = 0;
var dbconnection = mysql.createConnection ({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'respberry'
});//database connection option define

dbconnection.connect(function(err)
        {
        if (err)
        {
        console.error('mysql connection error');
        console.error(err);
        throw err;
        }
});//database connection function

function onRequest(request, response) {
    console.log('requested...');
    response.writeHead(200,{'Content-Type' : 'text/plain'});
    var piggyback = '';
    if(request.method=='POST') {
        var body='';
        request.on('data', function (data) {
                body +=data;
                });
        request.on('end',function(){
                var POST = qs.parse(body);
                //POST data retrieval
                console.log(POST);
                if(POST.power!=undefined)
                    updateQuery(POST.power);

                response.write(device_ip);
                response.end();
                });


    }//when request method is POST

    else if(request.method=='GET') {
        var url_parts = url.parse(request.url,true); //GET data retrieval
            console.log(url_parts.query);
        //       if
        //       (url_parts.query.device_reg_id!=undefined)
        //           insertQuery(url_parts.query.device_reg_id);
    }//when request method is GET
    //response.end();
};
function updateQuery (power){
    var query = dbconnection.query('update switch set power="'+power+'" where name="10001"',function(err,result){
            if (err)
            {
            console.error('err:'+err);
            throw err;
            }
         });
    query = dbconnection.query('select * from device_ip where name="10001"',function(err,rows){
            if (err)
            {
            console.error('err:'+err);
            throw err;
            }
            else
            {
               if (rows.length!=0)
               {
                   device_ip = rows[0].ip;
               }
            }
         });
}//update 'power' record into 'switch' table
//select 'ip' record from 'device_ip' table
function onConnection(socket){
    console.log('connected...');
};

var server = http.createServer();

server.addListener('request',onRequest);
server.addListener('connection',onConnection);
server.listen(8899);

