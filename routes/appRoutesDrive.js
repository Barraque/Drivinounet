'use strict';
module.exports = function(app) {
var express = require('express');
var todoList = require('../controller/appControllerDrive.js');

app.post('/drivivounet/login',function(req,res){
		todoList.get_auth(req,res);	
	});
app.get('/drivivounet/file/:name',function(req,res){
		todoList.get_a_file(req,res);	
	});
app.get('/drivivounet/liste',function(req,res){
		todoList.get_files(req,res);	
	});
app.post('/drivivounet/put',function(req,res){
		todoList.place_a_file(req,res);	
	});
}
