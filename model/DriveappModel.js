var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var mmm = require('mmmagic')
	Magic = mmm.Magic;
var drive = {};

drive.uploadfile = function(new_file,result){
	var form = new formidable.IncomingForm();
	form.parse(new_file);
	form.on('fileBegin',function(name,file){
		console.log(file.name);
		file.path = "file/" + file.name;
		 
	});
	form.on('file',function(name,file){
		result(null,file.name);
	});

};
drive.getlistoffiles = function(result) {
	var directoryPath = path.join(__dirname,"../file");
	console.log(directoryPath);
	fs.readdir(directoryPath,function(err,files){
		if( err )
			result(err,null);
		else{
			var liste = [];
			files.forEach(function (file){
				console.log(file);
				liste.push({"fichier":file});
			});
			result(null,liste);
		}
	});

};
drive.getafile = function(res,newpath,result){
	var filePath = path.join(__dirname,"../file/" + newpath);
	if(fs.existsSync(filePath)){
		var magic = new Magic(mmm.MAGIC_MIME_TYPE);
		magic.detectFile(filePath,function(err,type){
		if(err)
			result(err,null);
		var stat = fs.statSync(filePath);	
		console.log(type,stat.size);
		res.writeHead(200,{
			'Content-type': type,
			'Content-Lenght':stat.size
			});
		var rs = fs.createReadStream(filePath);
		result(null,rs.pipe(res));
		});
	}
	else{
		console.log("Le fichier "+newpath+" n'exsite pas");
		result("Le fichier "+newpath+" n'exsite pas",null);
	}
};
drive.deleteafile = function(newpath,result){
	var filePath = path.join(__dirname,"../file/"+newpath);
	if(fs.existsSync(filePath)){
		fs.unlink(filePath,(err) => {
			if(err){
				console.log(err);
				result(err,null);
			}
			else{
				console.log("file "+name+" deleted");
				result(null,"file "+name+" deleted");
			}
		});	
	}
	else{
		console.log("Le fichier "+name+" n'exsite pas");
		result("Le fichier "+name+" n'exsite pas",null);
	}

};
drive.moveafile = function(oldpath,newpath,result){
	var filePath = path.join(__dirname,"../file/" + oldpath);
	if(fs.existsSync(filePath)){
		fs.rename(filePath, path.join(__dirname,"../file/" + newpath), (err) => {
			if(err){
				console.log(err);
				result(err,null);
			}
			else{
				console.log("file "+oldpath+" moved");
				result(null,"file "+oldpath+" moved");
			}
		});	
	}
	else{
		console.log("Le fichier "+oldpath+" n'exsite pas");
		result("Le fichier "+oldpath+" n'exsite pas",null);
	}

};
module.exports = drive;
