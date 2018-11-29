var neo4jService = require("../../lib/Neo4jService");

function getEntityDefs(){

	return new Promise(function(resolve,reject){
		neo4jService.executeCypherCleanResult(
			/*then()*/
			function(result){
				const arrDefs = result.records[0].get("entityDefs");
				const entityDefs = {};
				arrDefs.forEach(function(d){
					entityDefs[d.name]=d.properties;
				});
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
module.exports={
		getEntityDefs:getEntityDefs
		};