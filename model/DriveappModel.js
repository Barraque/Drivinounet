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
drive.getafile = function(res,name,result){
	var filePath = path.join(__dirname,"../file/"+name);
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
		console.log("Le fichier "+name+" n'exsite pas");
		result("Le fichier "+name+" n'exsite pas",null);
	}
};
module.exports = drive;
