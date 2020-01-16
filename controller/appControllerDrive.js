'use strict';
var Drive = require('../model/DriveappModel.js');
var jwt = require('jsonwebtoken');
var Controller = {};
const secretkey = "secretkey";

Controller.get_auth = function(req,res){
	const spawn = require("child_process").spawn;
	const pythonProcess = spawn('python',['-u',__dirname + "/scriptpy/totppassword.py","SECRETBASED32"]);
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
	if(typeof bearer !== 'undifined'){
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
Controller.place_a_file = function(req,res) {
	if(verifyToken(req,res)){
		Drive.uploadfile(req,function(err,file){
			if (err){
				console.log(err);
				res.status(400);
				res.send(err);
			}
			else{
				console.log("file added");
				res.status(200);
				res.send(file)
			}
		});

	}
	else {
		res.sendStatus(403);
	}
};
Controller.get_files = function(req,res){
	if(verifyToken(req,res)){
		Drive.getlistoffiles(function(err,liste){
			if(err){
				console.log(err);
				res.status(500);
				res.send(err);
			}
			else{
				console.log(liste);
				res.status(200);
				res.send(liste);
			}
		});
	}
	else{
		res.sendStatus(403);
	}	
}
Controller.get_a_file = function(req,res){
	if(verifyToken(req,res)){
		Drive.getafile(res,req.body.newpath,(err,file)=>{
			if(err){
				console.log(err);
				res.status(400);
				res.send(err);
			}
			else{
				console.log(file);
			}
		});
	}
	else{
		res.sendStatus(403);
	}	
}
Controller.delete_a_file = function(req,res){
	if(verifyToken(req,res)){
		Drive.deleteafile(req.body.newpath,(err,file)=>{
			if(err){
				console.log(err);
				res.status(400);
				res.send(err);
			}
			else{
				console.log(file);
				res.send(file);
			}
		});
	}
	else{
		res.sendStatus(403);
	}	
}
Controller.mv_a_file = function(req,res){
	if(verifyToken(req,res)){
		Drive.moveafile(req.body.old,req.body.new,(err,file)=>{
			if(err){
				console.log(err);
				res.status(400);
				res.send(err);
			}
			else{
				console.log(file);
				res.send(file);
			}
		});
	}
	else{
		res.sendStatus(403);
	}	
}
module.exports = Controller;
