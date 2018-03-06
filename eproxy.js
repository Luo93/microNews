/**
 * Created by L
 */
var eventproxy = require('eventproxy');
var request = require('superagent');
var superagent=require('superagent-charset')(request);
var cheerio = require('cheerio');
var url = require('url');
var fs = require('fs');
var cnodeUrl = 'http://www.kanunu8.com/files/world/201102/1598.html';//http://gd.qq.com/l/gdfabu/gdfbzwjj/more.htm';
var sql = require('mssql');
superagent.get(cnodeUrl).charset()
    .end(function (err, res) {
        if (err) {
            return console.error(err);
        }
        var topicUrls = [];
        var $ = cheerio.load(res.text,{decodeEntities: false}); //cheerio like jquery
        $('.list01 li a').each(function (idx, element) {
            var $element = $(element);
            var href = url.resolve(cnodeUrl, $element.attr('href'));
            var title = $element.text();
            topicUrls.push({href:href,title:title});
        });
        var fileStr="";
        var ep = new eventproxy();
        ep.after('topic_html', topicUrls.length, function (topics) {
           var topics = topics.map(function (topicPair) {  //map 处理对象，再返回新对象
                        var topicUrl = topicPair[0];
                        var topicHtml = topicPair[1];
                        var $ = cheerio.load(topicHtml,{decodeEntities: false});
                        var cm = $('#Cnt-Main-Article-QQ').html()||"";
                        var date = $('.hd .a_time').text()||$('.hd .article-time').text()||"";
                        fileStr +="title : "+topicUrl.title+";url : "+topicUrl.href+";date : "+date+/*";content:"+cm+*/"\n";
                        return ({
                            title:  topicUrl.title||"无",
                            url: topicUrl.href,
                            comment: cm,
                            date:date
                });
            });
           //console.log(topics);
            //write files
            /*fs.writeFile("node3.txt",fileStr,function(err){
                if(err) return console.error(err);
            });*/
           // insert into database
            var conUrl="mssql://sa:123456@localhost:1433/text";
            sql.connect(conUrl, function (err, conn) {
                if (err) {
                    console.log(err);
                    return;
                }
                const request = new sql.Request();
                topics.forEach(function(topic){
                    var sqlL="INSERT INTO press (Title, Content, Origin,Date) VALUES ('"+topic.title+"','"+topic.comment+"','"+topic.url+"','"+topic.date+"')";
                    request.query(sqlL, function( e, r ) {
                        if (e) {
                            console.log(e);
                        }
                        console.log("success");
                        sql.close();
                    });
                });
            });
        });
        topicUrls.forEach(function (topicUrl) {
            superagent.get(topicUrl.href).charset()
                .end(function (err, res) {
                    ep.emit('topic_html', [topicUrl, res.text]);
                });
        });
    });
