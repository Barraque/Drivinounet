'use strict';
module.exports = function(app) {
var express = require('express');
var todoList = require('../controller/appControllerDrive.js');
app.post('/drivinounet/login',function(req,res){
		todoList.get_auth(req,res);	
	});
app.post('/drivinounet/file',function(req,res){
		todoList.get_a_file(req,res);	
	});
app.post('/drivinounet/liste',function(req,res){
		todoList.get_files(req,res);	
	});
app.post('/drivinounet/uploadfile',function(req,res){
		todoList.place_a_file(req,res);	
	});
app.delete('/drivinounet/file',function(req,res){
		todoList.delete_a_file(req,res);
	});
app.put('/drivinounet/mkdir',function(req,res){
		todoList.create_a_dir(req,res);	
	});
app.post('/drivinounet/mv',function(req,res){
		todoList.mv_a_file(req,res);	
	});
app.post('/drivinounet/getTar',function(req,res){
		todoList.get_a_tar(req,res);	
	});
app.post('/drivinounet/getPassword',function(req,res){
		todoList.get_the_password(req,res);	
	});
}
