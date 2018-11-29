var neo4j = require('neo4j-driver').v1;
var cypherService = require("./cypherService");
require('dotenv').config();

console.log("Neo4jService Loading...");

var auth = neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD);
var connection = process.env.NEO4J_PROTOCOL+"://"+process.env.NEO4J_HOST+":"+process.env.NEO4J_PORT;
console.log("NEO4J Connection: "+ connection);
var driver = neo4j.driver(connection, auth);
var lastSession=  Date.now();
var RESET_INTERVAL=1*60*1000 //1 minute

/*
driver.onCompleted = function () {
	console.log("Sucessful connection "+connection);
};
driver.onError = function (error) {
	console.log('Driver instantiation failed', error);
};
*/
function getNewSession()
{
	var now = Date.now();
	if(!lastSession || (now - lastSession)>RESET_INTERVAL ){
		if(lastSession){ // there is an existing driver connection so close it.
			driver.close();
		}
		driver = neo4j.driver(connection, auth);
/*
		driver.onCompleted = function () {
			console.log("Sucessful connection "+connection);
		};
		driver.onError = function (error) {
			console.log('Driver instantiation failed', error);
		};
*/
		lastSession = now;
	}
	var session = driver.session();
	return session;
}
function executeCypher(onThen,onError,query,params,debug){
	var session = getNewSession();
	var params = params || {};
	var cypher;
	if(query.endsWith(".cyp")){
		cypher = cypherService.loadCypher(query);
	}else{
		cypher = query;
	}
	if(debug){
		console.log(`***executeCypher***\nQueryName: (${query.endsWith(".cyp")?query:""})\nCypher:\n${cypher}\nParams:\n${JSON.stringify(params)}`);
	}
	
	session
	.run(cypher,params)
	.then(function(result){
		session.close();
		if(debug){
			console.log(`executeCypher RESULT:\n${JSON.stringify(result)}`);
		}
		onThen(result);
	})
	.catch(function(error){
		session.close();
		console.log(`executeCypher ERROR: ${error}`);
		onError(error);
	});		
}
function executeCypherCleanResult(onThen,onError,queryName,params,debug){
	executeCypher(
		function(result){
			cleanResults={records:[]};
			if(result.records){
				if(result.records.length==1){
					result.records=[cleanRecord(result.records[0])];
				}else{
					const clean=[];
					result.records.forEach(function(record){
						clean.push(cleanRecord(record));
					});
					result.records=clean;
				}
			}
			onThen(result);
		} ,
		onError,
		queryName,
		params,
		debug
	);
}

function cleanRecord(record){
	var _fields=[];
	console.log(`RESULT: ${JSON.stringify(record)}`);
	_fields=_cleanObj(record._fields);
	record._fields=_fields;
	console.log(`CLEAN_RESULT :${JSON.stringify(record)}`);
	return record;
}

function _cleanObj(obj){
	if(isNeo4jNumber(obj)){
		return neo4j.integer.toNumber(obj);
	}else if(isArray(obj)){
		const a=[];
		let i=0;
		for(i;i<obj.length;i++){
			a.push(_cleanObj(obj[i]));
		}
		return a;
	}else if(isObject(obj)){
		const o={};
		for(key in obj){
			o[key]=_cleanObj(obj[key]);
		}
		return o;
	}else{
		return obj;
	}
}

// Is a given variable an object?
function isObject(obj) {
	return obj === Object(obj);
}
function isArray(obj){
	return Array.isArray(obj);
}
function isNeo4jNumber(obj){
	return obj.hasOwnProperty('low') && obj.hasOwnProperty('high');
}

module.exports ={
//	driver: driver,
	toNumber: neo4j.integer.toNumber,
	executeCypher:executeCypher,
	executeCypherCleanResult:executeCypherCleanResult,
	cleanObj:_cleanObj
}