var express = require('express');
var db = require("../db.js");
var moment = require('moment');
var url = require('url');
var router = express.Router();
/* GET home page. */
router.get('/:id', function(req, res, next) {
    var sqlL = "select * from press where Id = "+req.params.id;
  db.query(sqlL,function(data){
      var dataObj = data.recordset;
      var date1 = dataObj[0].Date;
      date1=moment(date1).format('YYYY-MM-DD');
      var title = dataObj[0].Title;
      var content = dataObj[0].Content;
      var org = dataObj[0].Origin;
   res.render('detail', { title: title,date:date1,content:content,org:org,current:""});
  });
});

module.exports = router;
