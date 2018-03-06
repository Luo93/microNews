/**
 * Created by Administrator on 2017/8/25 0025.
 */
var mssql = require('mssql');
var db = {};
var conUrl="mssql://sa:123456@localhost:1433/text";
db.query=function(sql,fn){
    mssql.connect(conUrl, function (err, conn) {
        if (err) {
            console.log("Error opening the connection : "+err);
            return;
        }
        const request = new mssql.Request();
        request.query(sql,function(e,r){
            if (e) {
                console.log("Error querying the table : "+e);
            }
            fn(r);
            mssql.close();
        });
    });
};
module.exports=db;