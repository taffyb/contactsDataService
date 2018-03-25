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
			cleanResults=[];
			if(result.records){
				if(result.records.length==1){
					onThen(cleanRecord(result.records[0]));
				}else{
					result.records.forEach(function(record){
						cleanResults.push(cleanRecord(record));
					});
					onThen(cleanResults);
				}
			}			
		} ,
		onError,
		queryName,
		params,
		debug
	);
}

function cleanRecord(record){
	var cleanResult={};
//	console.log(`RESULT: ${JSON.stringify(record)}`);
	record.keys.forEach(function(key){
//		console.log(`KEY:${key}= ${JSON.stringify(record.get(key))}`);
		if(record.get(key).properties){
			cleanResult[key]={};
			var props = record.get(key).properties;
//			console.log(`PROPERTIES :${JSON.stringify(props)}`);
			for(p in props){
//				console.log(`PROPERTY :${p} ${JSON.stringify(props[p])}`);
				if(isObject(props[p])){	
					if(isNeo4jNumber(props[p])){
						cleanResult[key][p]=neo4j.integer.toNumber(props[p]);
					}else{
						cleanResult[key][p]=props[p];
					}
				}else{
					cleanResult[key][p]=props[p];
				}
			}
		}else{
			cleanResult[key]=record.get(key);
		}		
	});
//	console.log(`CLEAN_RESULT :${JSON.stringify(cleanResult)}`);
	return cleanResult;
}

// Is a given variable an object?
function isObject(obj) {
	return obj === Object(obj);
};

function isArray(obj){
	return Array.isArray(obj);
}
function isNeo4jNumber(obj){
	return obj.low && obj.high;
}

module.exports ={
//	driver: driver,
	toNumber: neo4j.integer.toNumber,
	executeCypher:executeCypher,
	executeCypherCleanResult:executeCypherCleanResult
}