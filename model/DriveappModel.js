var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var mmm = require('mmmagic')
	Magic = mmm.Magic;
var drive = {};

drive.uploadfile = function(new_file,res,result){
	var form = new formidable.IncomingForm();
	form.parse(new_file);
	form.on('fileBegin',function(name,file){
		console.log(file.name);
		file.path = "file/" + file.name;
		 
	});
	form.on('file',function(name,file){
		result(res,null,200,file.name);
	});

};
drive.createdir = function(newpath,res,result){
	var filePath = path.join(__dirname,"../file/" + newpath);
	console.log(newpath);
	if(!fs.existsSync(filePath)){
		fs.mkdirSync(filePath);
		result(res,null,200,filePath);
	}
	else{
		console.log("Le dossier "+newpath+" exsite");
		result(res,"Le dossier "+newpath+" exsite",400,null);
	}
};
drive.getlistoffiles = function(newpath,res,result) {
	var directoryPath = path.join(__dirname,"../file/"+newpath);
	console.log(directoryPath);
	fs.readdir(directoryPath,function(err,files){
		if( err )
			result(res,err,500,null);
		else{
			var liste = [];
			var typedefichier = null;
			files.forEach(function (file){
				console.log(file);
				if(fs.lstatSync(directoryPath +"/"+file).isDirectory()){
					type = "dossier";
					console.log("ici dossier");
				}
				else{
					type = "fichier";
				}
				var obj = {};
				obj[type] = file;
				liste.push(obj);
			});
			result(res,null,200,liste);
		}
	});

};
drive.getafile = function(res,newpath,result){
	var filePath = path.join(__dirname,"../file/" + newpath);
	console.log(filePath);
	if(fs.existsSync(filePath)){
		res.status(200);
		res.download(filePath);
	}
	else{
		console.log("Le fichier "+newpath+" n'exsite pas");
		result(res,"Le fichier "+newpath+" n'exsite pas",400,null);
	}
};
drive.deleteafile = function(newpath,res,result){
	var filePath = path.join(__dirname,"../file/"+newpath);
	if(fs.existsSync(filePath)){
		fs.unlink(filePath,(err) => {
			if(err){
				console.log(err);
				result(res,err,500,null);
			}
			else{
				console.log("file "+newpath+" deleted");
				result(res,null,200,"file "+newpath+" deleted");
			}
		});	
	}
	else{
		console.log("Le fichier "+newpath+" n'exsite pas");
		result(res,"Le fichier "+newpath+" n'exsite pas",200,null);
	}

};
drive.moveafile = function(oldpath,newpath,res,result){
	var filePath = path.join(__dirname,"../file/" + oldpath);
	if(fs.existsSync(filePath)){
		fs.rename(filePath, path.join(__dirname,"../file/" + newpath), (err) => {
			if(err){
				console.log(err);
				result(res,err,500,null);
			}
			else{
				console.log("file "+oldpath+" moved");
				result(res,null,200,"file "+oldpath+" moved");
			}
		});	
	}
	else{
		console.log("Le fichier "+oldpath+" n'exsite pas");
		result(res,"Le fichier "+oldpath+" n'exsite pas",400,null);
	}

};
module.exports = drive;
