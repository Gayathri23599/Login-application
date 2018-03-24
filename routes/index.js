var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var c_id = null;
var s__id = null;
var loginto = require('../modules/loginto');
var connection = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"joker@23599",
	database:"fit"
});


/* GET home page. */
router.get('/', function(req, res, next) {
  var date = new Date();
  console.log(date);
  console.log(req.sessionID);
  s_id = req.sessionID;	
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
		if(!err){
			var sql = "INSERT INTO client(name,email,password) VALUES (?,?,?) ";
			connection.query(sql,[item.name,item.email,item.pwd],function(err){
				if(!err)
					console.log('Registration successful');
				else
					console.log(err)
			});
		}
		else
			res.render('error');
	});
	res.render('data' ,{items:item});
});

router.post('/login',loginto.login);


router.get('/logout',function(req,res,next){
	//req.logout();
	//req.session = null;
	//req.session.cookie.expires = new Date(Date.now() + 0);
	//req.session.cookie.maxAge = 0;
	if(req.sessionID)
		console.log('not deleted');
	else
		console.log('deleted the session');
	res.render('login',{title:"You have successfully logged out"});
});

router.post('/logout',loginto.login);

router.get('/success',function(req,res,next){
	var sql = "SELECT * FROM(SELECT * FROM client WHERE client_id = ? )INNER JOIN bmi ON bmi.c_id = client.client_id"
	connection.query(sql,[c_id],function(err,results){
		if(!err){
			console.log(results);
			res.render('success',{results});
		}
		else{
			console.log('error');
			res.render('error');
		}
	});
			
});	
module.exports = router;
