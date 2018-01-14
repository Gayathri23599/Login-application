var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"",
	database:"data"
});

/*connection.connect(function(err){
	var sql = "CREATE TABLE details (name VARCHAR(255) , pwd VARCHAR(255))";
	connection.query(sql);
});*/

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/signup', function(req,res,next) {
   res.render('signup');
});

router.get('/login', function(req,res,next) {	
   res.render('login');
});

router.post('/signup',function(req,res,next) {
	var item = req.body;
	connection.connect(function(err){
		var sql = "INSERT INTO details VALUES (?,?) ";
		connection.query(sql,[item.name,item.pwd]);
	});
	res.render('data' ,{items:item});
});

router.post('/login',function(req,res,next) {
	var l_name = req.body.name;
	var l_pwd = req.body.pwd;
	connection.connect(function(err){
		var sql = "SELECT * FROM details WHERE name=? AND pwd = ?" ;
		connection.query(sql,[l_name,l_pwd],function(err,result){			
			if(result.length>0)
				 res.render('success');
			else
				res.render('relogin');
		});
	});
});

module.exports = router;
