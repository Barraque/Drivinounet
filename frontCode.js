function clear(){
	document.getElementById("truc").innerHTML ="";
}
function sendfile(chose){
	var formData = new FormData(chose);

	$.ajax({
		url: 'https://yourdomain.com/drivinounet/uploadfile',
		type: 'POST',
		data: formData,
		success: function (data) {
			getlist();
		},
		error: function(err) {
			alert("An error has occured");
		},
		cache: false,
		contentType: false,
		processData: false
	});
}
function getfile(name){
	var xhr = new XMLHttpRequest();
	xhr.open('POST', "https://yourdomain.com/drivinounet/file", true);
	xhr.setRequestHeader("Content-type","application/json");
	xhr.responseType = 'blob';
	//xhr.responseType = 'arraybuffer';
	xhr.onload = function () {
		if (this.readyState == 4 && this.status === 200) {
			var blob = xhr.response;
			var url = window.URL.createObjectURL(blob);
			var aLink = document.createElement('a');
			document.body.appendChild(aLink);
			aLink.href = url;
			aLink.download = name;
			aLink.click();
		}
	};
	xhr.send(JSON.stringify({"path":path + "/"+name}));
}
function gettar(){
	var xhr = new XMLHttpRequest();
	xhr.open('POST', "https://yourdomain.com/drivinounet/gettar", true);
	xhr.setRequestHeader("Content-type","application/json");
	xhr.responseType = 'blob';
	xhr.onload = function () {
		if (this.readyState == 4 && this.status === 200) {
			var blob = xhr.response;
			var url = window.URL.createObjectURL(blob);
			var aLink = document.createElement('a');
			document.body.appendChild(aLink);
			aLink.href = url;
			aLink.download = name;
			aLink.click();
		}
	};
	xhr.send(JSON.stringify({"path":path}));
}
function getlist(){
	clear()
	document.getElementById("currentpath").innerHTML = "Path: "+ path;  
	var req = new XMLHttpRequest();
	req.responseType = 'json';
	req.open("POST","https://yourdomain.com/drivinounet/liste");
	req.setRequestHeader("Content-type","application/json");
	req.onload = function(){
		if(req.readyState == 4 && req.status == 200){
			var jsson = req.response;
			var div = document.getElementById("truc");
			jsson.forEach(element => {
				var newp = document.createElement("button");
				if(Object.keys(element)[0] == "dossier"){
					newp.onclick=function(){
						(path = path +"/"+ (element[Object.keys(element)[0]]))
						getlist();
					};
				}
				else{
					newp.onclick = function(){getfile(element[Object.keys(element)[0]]);};
				}
				newp.innerHTML=Object.keys(element)[0]+" : " +element[Object.keys(element)[0]];
				div.appendChild(newp);
				let vers = document.createElement("button");
				vers.onclick = function(){
					cleardivenplus();
					origine = path +"/"+ (element[Object.keys(element)[0]]);
					destination = (element[Object.keys(element)[0]]);
					let divenplus = document.getElementById("ici");
					let but = document.createElement("button");
					but.onclick = deplacer;
					but.innerHTML = "Deplacer ici";
					divenplus.append(but);
					divenplus.append(document.createElement("br"));
					divenplus.append(document.createElement("br"));
				};
				vers.innerHTML = "deplacer vers";
				div.appendChild(vers);
				let sup = document.createElement("button");
				sup.innerHTML = "X";
				sup.onclick = function(){
					deletefile(path +"/"+ (element[Object.keys(element)[0]]));
				};
				div.appendChild(sup);
				div.appendChild(document.createElement("br"));
				div.appendChild(document.createElement("br"));
			});
		}
	}
	var obj = JSON.stringify({"path":path});
	req.send(obj);
}
function sendpassword(){
	var req = new XMLHttpRequest();
	req.responseType = 'json';
	req.open("POST", "https://yourdomain.com/drivinounet/login");
	req.setRequestHeader("Content-type","application/json");
	req.onload = function(){
		if(req.readyState == 4 && req.status == 200){
			//document.cookie='access_token ='+req.response[Object.keys(req.response)[0]];
			getlist();
		}
		else if (req.stringify == 403) alert("Bad password");
	}
	req.send(JSON.stringify({"passwd":document.getElementById("passwd").value}));

}
function back(){
	if(path != "."){
		path = path.substring(0,path.lastIndexOf('/'));
		getlist();
	}
}

function deletefile(path){
	var req = new XMLHttpRequest();
	req.responseType = 'json';
	req.open("DELETE", "https://yourdomain.com/drivinounet/file");
	req.setRequestHeader("Content-type","application/json");
	req.onload = function(){
		if(req.readyState == 4 && req.status == 200){
			getlist();
		}
		else if(req.status == 401){alert("Dossier non vide");}
		else {alert("Oups")};
	}
	req.send(JSON.stringify({"path":path}));

}
function cleardivenplus(){
	document.getElementById("ici").innerHTML = "";
}
function deplacer(){
	var req = new XMLHttpRequest();
	req.responseType = 'json';
	req.open("POST", "https://yourdomain.com/drivinounet/mv");
	req.setRequestHeader("Content-type","application/json");
	req.onload = function(){
		if(req.readyState == 4 && req.status == 200){
			getlist();
		}
		else {alert("Oups")};
	}
	req.send(JSON.stringify({"old":origine,"new":path+"/"+destination}));
	destination = ".";
	cleardivenplus();
}

function mkdir(){
	if(document.getElementById("dossier").value != ""){ 
		const regex = RegExp("^[A-Za-z0-9$\-_&\(\)?@#][A-Za-z0-9$\-_&\(\)?@#]*$","giy");
		if(!regex.test(document.getElementById("dossier").value)){
			alert("Mauvais nom");
			return;
		}
		var req = new XMLHttpRequest();
		req.responseType = 'json';
		req.open("PUT", "https://yourdomain.com/drivinounet/mkdir");
		req.setRequestHeader("Content-type","application/json");
		req.onload = function(){
			if(req.readyState == 4 && req.status == 200){
				getlist();
			}
			else {alert("LEEERRROOOYYYYYYY JENKINS")};
		}
		req.send(JSON.stringify({"path":path + "/" + document.getElementById("dossier").value }));
	}
}

