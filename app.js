var express = require('express');
var router = express.Router(); 
var logger = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
require('dotenv').config();

var app = express();
var port = process.env.APP_PORT;

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb', type: 'application/json'}));
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));


/**
 * On all requests add headers
 */
app.all('*', function(req, res,next) {

    /**
     * Response settings
     * @type {Object}
     */
    var responseSettings = {
        "AccessControlAllowOrigin": req.headers.origin,
        "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
        "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
        "AccessControlAllowCredentials": true
    };

    /**
     * Headers
     */
    res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
    res.header("Access-Control-Allow-Origin",  responseSettings.AccessControlAllowOrigin);
    res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
    res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);

    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
var datasets = require('./routes/datasets');
var users = require('./routes/users');

app.use('/api', router);
app.use('/api/datasets', datasets);
app.use('/api/users', users);

// REGISTER OUR ROUTES -------------------------------
// all of our administration routes will be prefixed with /adminapi

var adminTopics = require('./routes/admin/topics');
var adminDatasets = require('./routes/admin/datasets');
var adminKeywords = require('./routes/admin/keywords');
var adminMeasures = require('./routes/admin/measures');
var adminPublishers = require('./routes/admin/publishers');
var adminPublications = require('./routes/admin/publications_routes');
var adminBaseData = require('./routes/admin/data');
app.use("/adminapi/topics/", adminTopics);
app.use("/adminapi/datasets/", adminDatasets);
app.use("/adminapi/keywords/", adminKeywords);
app.use("/adminapi/measures/", adminMeasures);
app.use("/adminapi/publishers/", adminPublishers);
app.use("/adminapi/publications/", adminPublications);
app.use("/adminapi/data/", adminBaseData);

// REGISTER OUR ROUTES -------------------------------
// all of our reporting routes will be prefixed with /rptapi
var rptRoutes = require('./routes/reporting/rpt_routes');
app.use("/rptapi/", rptRoutes);

try{
	
}catch(error){
	console.log(error);
	driver.close();
}

app.listen(port);
var now = new Date();
console.log('Server started on port '+port+' '+now);

module.exports = app;
