var express = require('express'),
	app = express(),
	bodyparser = require('body-parser');
	port = process.env.PORT || 8081;


app.listen(port);
console.log('server started');

app.use(bodyparser.urlencoded({extended : true}));
app.use(bodyparser.json());

var routes = require('./routes/appRoutesDrive.js');
routes(app);
