var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var c__id = null;
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
	console.log(c_id);	
	var sql = "SELECT * FROM (SELECT * FROM client WHERE client_id = ? ) a  INNER JOIN bmi ON bmi.c_id = a.client_id";
	//console.log(sql);
	connection.query(sql,[c_id],function(err,results){
		if(!err){
			console.log(results);
			var item = results[0];
			res.render('success',{item});
		}
		else{
			console.log('error');
			res.render('error');
		}
	});
			
});

router.get('/dashboard',function(req,res,next){
	res.render('dashboard');
});

router.post('/dashboard',function(req,res,next){
	var item = req.body;
	var sql = "UPDATE client SET address = ? , workplace = ? , designation = ? where client_id = ?";
	connection.query(sql,[item.address,item.workplace,item.desg,c_id],function(err,results){
		if(err){
			console.log(err);
			res.redirect('/dashboard');
		}
	});
	var qry = "UPDATE bmi SET height=?,weight=?,date_of_birth=? where c_id=?";
	connection.query(qry,[item.height,item.weight,item.dob,c_id],function(err,result){
		if(err){
			console.log(err);
			res.redirect('/dashboard');
		}
	});
	res.redirect('/success');
});
	
module.exports = router;
