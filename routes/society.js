var express = require('express');
var db = require("../db.js");
var moment = require('moment');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  db.query("select top 10 Id,Title,Date from press",function(data){
    var dataObj = data.recordset;
    var allData = dataObj.map(function(data1){
          var date1 = data1.Date;
          date1=moment(date1).format('YYYY-MM-DD');
          return ({
              Id : data1.Id,
              Title:data1.Title,
              Date:date1
          })
    });
    res.render('index', { title: '社会新闻列表页',content:allData,current:"1"});
   // console.log(data.recordset);
  });
});

module.exports = router;
