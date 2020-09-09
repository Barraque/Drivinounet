require('dotenv').config();
var express = require('express'),
	app = express(),
	bodyparser = require('body-parser'),
	zip = require('express-easy-zip');
	port = process.env.PORT || 8081;
var cookieParser = require('cookie-parser');
const helmet = require('helmet');

app.listen(port);
console.log('server started');

app.use(bodyparser.urlencoded({extended : true}));
app.use(bodyparser.json());
app.use(helmet());
app.use(cookieParser());
app.use(zip());

var routes = require('./routes/appRoutesDrive.js');
routes(app);
