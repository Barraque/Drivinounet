'use strict';
module.exports = function(app) {
var express = require('express');
var todoList = require('../controller/appControllerDrive.js');

app.post('/drivinounet/login',function(req,res){
		todoList.get_auth(req,res);	
	});
app.get('/drivinounet/file',function(req,res){
		todoList.get_a_file(req,res);	
	});
app.get('/drivinounet/liste',function(req,res){
		todoList.get_files(req,res);	
	});
app.put('/drivinounet/file',function(req,res){
		todoList.place_a_file(req,res);	
	});
app.delete('/drivinounet/file/:name',function(req,res){
		todoList.delete_a_file(req,res);
	});
app.get('/drivinounet/mv',function(req,res){
		todoList.mv_a_file(req,res);	
	});
}
