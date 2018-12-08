var neo4jService = require("../../lib/Neo4jService");

function getEntityDefs(){

	return new Promise(function(resolve,reject){
		neo4jService.executeCypherCleanResult(
			/*then()*/
			function(result){
				const entityDefs = result.records[0].get("entityDefs");
				resolve(entityDefs);
			},
			/*catch()*/
			function (error) {
				console.log(`${error}`);
				reject(error);
			},
			/*name of cypher file*/
			"getEntityDefs.cyp"
		);
	});
}
function newEntityDef(entityDef){

	return new Promise(function(resolve,reject){
		neo4jService.executeCypherCleanResult(
			/*then()*/
			function(result){
				const entityDefs = result.records[0].get("success");
				resolve(entityDefs);
			},
			/*catch()*/
			function (error) {
				console.log(`${error}`);
				reject(error);
			},
			/*name of cypher file*/
			"newEntityDef.cyp",
			{entityDef:entityDef},true
		);
	});
}

function getEntites(filter){
	return new Promise(function(resolve,reject){
		neo4jService.executeCypherCleanResult(
			/*then()*/
			function(result){
				const entities = result.records[0].get("entities");
				resolve(entities);
			},
			/*catch()*/
			function (error) {
				console.log(`${error}`);
				reject(error);
			},
			/*name of cypher file*/
			"getEntity.cyp",
			{filter:filter}
		);
	});
}

function addEntity(entity){
	return new Promise(function(resolve,reject){
		neo4jService.executeCypherCleanResult(
			/*then()*/
			function(result){
				const GUID = result.records[0].get("GUID");
				resolve(GUID);
			},
			/*catch()*/
			function (error) {
				console.log(`${error}`);
				reject(error);
			},
			/*name of cypher file*/
			"addEntity.cyp",
			{entity:entity}
		);
	});
}
module.exports={
		getEntityDefs:getEntityDefs,
		getEntites:getEntites,
		addEntity:addEntity,
		newEntityDef:newEntityDef
		};