var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var drive = {};

drive.uploadfile = function(new_file,res,result){
	var form = new formidable.IncomingForm();
	form.parse(new_file,(err,fields,files) =>{
		if(err){
			console.log(err);
		}
	
	});
	form.on('fileBegin',function(name,file){
		console.log(file.name);
		file.path = path.join(__dirname, "../file", file.name);
		 
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
	fs.readdir(directoryPath,function(err,files){
		if( err )
			result(res,err,500,null);
		else{
			var liste = [];
			var typedefichier = null;
			files.forEach(function (file){
				if(fs.lstatSync(directoryPath +"/"+file).isDirectory()){
					type = "dossier";
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
	var callb = function(err){
		if(err){
			console.log(err);
			result(res,err,401,null);
		}
		else{
			console.log("file "+newpath+" deleted");
			result(res,null,200,"file "+newpath+" deleted");
		}

	};
	if(fs.existsSync(filePath)){
		if(fs.lstatSync(filePath).isDirectory()){
			fs.rmdir(filePath,(err) => {callb(err);});
		}
		else{
			fs.unlink(filePath,(err) => {callb(err);});
		}
	}
	else{
		console.log("Le fichier "+newpath+" n'exsite pas");
		result(res,"Le fichier "+newpath+" n'exsite pas",200,null);
	}

};
drive.moveafile = function(oldpath,newpath,res,result){
	var filePath = path.join(__dirname,"../file/" + oldpath);
	var newpath = path.join(__dirname,"../file/" + newpath);
	console.log(oldpath + " -> " + newpath);
	if(fs.existsSync(filePath)){
		if(fs.lstatSync(filePath).isDirectory()){
			fs.rename(filePath, newpath, function (err) {
				if (err) {
					if (err.code === 'EXDEV') {
						copy();
					} else {
						result(res,err,500,null);
					}
					return;
				}

				result(res,null,200,"file "+filePath+" moved");
			});

			function copy() {
				var readStream = fs.createReadStream(oldpath);
				var writeStream = fs.createWriteStream(newpath);

				readStream.on('error', callback);
				writeStream.on('error', callback);

				readStream.on('close', function () {
					fs.unlink(oldpath, callback);
				});

				readStream.pipe(writeStream);
			}
		}
		else
		{
			fs.rename(filePath,newpath, (err) => {
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
	}
	else{
		console.log("Le fichier "+oldpath+" n'exsite pas");
		result(res,"Le fichier "+oldpath+" n'exsite pas",400,null);
	}
};
drive.gettar = function(newpath,res,result){

	var filePath = path.join(__dirname,".." ,"/file/",newpath);

	if(fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()){
		res.zip({
			files:[{
				path:filePath,
				name:"target"
			}],
			filename:"target.zip"
		});
	}
	else{
		console.log("Le dossier "+newpath+" n'exsite pas");
		result(res,"Le dossier "+newpath+" n'exsite pas",400,null);
	}

};
module.exports = drive;
