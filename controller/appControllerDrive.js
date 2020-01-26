'use strict';
var Drive = require('../model/DriveappModel.js');
var jwt = require('jsonwebtoken');
var Controller = {};
const secretkey = "secretkey";

Controller.get_auth = function(req,res){
	const spawn = require("child_process").spawn;
	const pythonProcess = spawn('python',['-u',__dirname + "/scriptpy/totppassword.py","SECRETKEYBASED32"]);
	pythonProcess.stdout.on('data',(passwd) => {
		if(req.body.passwd.toString() == JSON.parse(passwd)){
			jwt.sign({passwd},secretkey,{expiresIn:'5m'},(err,token) => {
			console.log(token);
			res.json({token:token});	
			});
		}
		else{
			res.sendStatus(403);
		}
	});


};
function verifyToken(req,res){
	const bearer = req.headers['authorization'];
	if(typeof bearer !== 'undifined' && bearer != null){
		const bearerToken = bearer.split(' ')[2];
		req.token = bearerToken;	
		return (jwt.verify(req.token,secretkey,(err,data) => {
			if(err){
				return false;
			}
			return true;
		}));
	}
	else{
		return false;
	}
}
var resultat = function(res,err,stat,msg){
	if (err){
		console.log(err);
		res.status(stat);
		res.send(err);
	}
	else{
		console.log(msg);
		res.status(stat);
		res.send(msg)
	}
};

Controller.place_a_file = function(req,res) {
	if(verifyToken(req,res)){
		Drive.uploadfile(req,res,resultat);
	}
	else {
		res.sendStatus(403);
	}
};
Controller.get_files = function(req,res){
	if(verifyToken(req,res) && req.body.path != null){
		Drive.getlistoffiles(req.body.path,res,resultat);
	}
	else{
		res.sendStatus(403);
	}	
}
Controller.get_a_file = function(req,res){
	if(verifyToken(req,res)&& req.body.path != null){
		Drive.getafile(res,req.body.path,resultat);
	}
	else{
		res.sendStatus(403);
	}	
}
Controller.delete_a_file = function(req,res){
	if(verifyToken(req,res)&& req.body.path != null){
		Drive.deleteafile(req.body.path,res,resultat);
	}
	else{
		res.sendStatus(403);
	}	
}
Controller.mv_a_file = function(req,res){
	if(verifyToken(req,res) && req.body.old != null && req.body.new != null){
		Drive.moveafile(req.body.old,req.body.new,res,resultat);
	}
	else{
		res.sendStatus(403);
	}	
}
Controller.create_a_dir = function(req,res){
	if(verifyToken(req,res) && req.body.path != null){
		Drive.createdir(req.body.path,res,resultat);
	}
	else{
		res.sendStatus(403);
	}	
}
module.exports = Controller;
