var neo4jService = require("../../lib/Neo4jService");

function addRelationship(relationship,entityDef){
	let cypher = "addRelationship.cyp";
	if(entityDef){
		cypher = "addEntityDefRelationship.cyp";
	}
	console.log(`addRelationship( ${JSON.stringify(relationship)})`);
	return new Promise(function(resolve,reject){
		neo4jService.executeCypherCleanResult(
			/*then()*/
			function(result){
				let success = result.records[0].get("success");
				console.log(`success: ${success}`);
				resolve(success);
			},
			/*catch()*/
			function (error) {
				console.log(`${error}`);
				reject(error);
			},
			/*name of cypher file*/
			cypher,
			{rel:relationship},true
		);
	});
}
module.exports={
		addRelationship:addRelationship
}