var neo4jService = require("../../lib/Neo4jService");

function getNodeTypes(){

	return new Promise(function(resolve,reject){
		neo4jService.executeCypher(
			/*then()*/
			function(result){
				var nTypes = result.records[0].get("nodeTypes");
				var nodeTypes = {};
				nTypes.forEach(function(t){
					nodeTypes[t.type[0]]=t.keys;
				});
				resolve(nodeTypes);
			},
			/*catch()*/
			function (error) {
				console.log(`${error}`);
				reject(error);
			},
			/*name of cypher file*/
			"getNodeTypes.cyp"
		);
	});
}
function getEdges(){

	return new Promise(function(resolve,reject){
		neo4jService.executeCypher(
			/*then()*/
			function(result){
				var edges = result.records[0].get("edges");
				edges.forEach(function(e){
					e.id = neo4jService.toNumber(e.id);
				});
				resolve(edges);
			},
			/*catch()*/
			function (error) {
				console.log(`${error}`);
				reject(error);
			},
			/*name of cypher file*/
			"getEdges.cyp",{},true
		);
	});
}
function getNodes(){

	return new Promise(function(resolve,reject){
		neo4jService.executeCypher(
		/*then()*/
		function(result){
			var nodes = {};
			result.records[0].get("nodes").forEach(function(n){
				console.log(`n=${JSON.stringify(n)}`);
				var type = n.type[0];
				var UUID = n.UUID;
				if(!nodes[type]){
					nodes[type]={};
				}
				nodes[type][UUID]=n;
				delete nodes[type][UUID].UUID;
				delete nodes[type][UUID].type;
			});
			//console.log(`nodes=${JSON.stringify(nodes)}`);
			resolve(nodes);
		},
		/*catch()*/
		function (error) {
			console.log(`Svc: ${error}`);
			reject(error);
		},
		/*name of cypher file*/
		"getNodes.cyp"
	);
});
}
function addNodes(nodes){

	return new Promise(function(resolve,reject){
		neo4jService.executeCypher(
			/*then()*/
			function(result){
				var nodes = result.records[0].get("nodes");
				var newNodes={};
				nodes.forEach(function(n){
					if(!newNodes[n.type]){
						newNodes[n.type]={};
					}
					newNodes[n.type][n.UUID]=n.properties;
				});
				resolve(newNodes);
			},
			/*catch()*/
			function (error) {
				console.log(`${error}`);
				reject(error);
			},
			/*name of cypher file*/
			"addNodes.cyp",
			{nodes:nodes}
		);
	});
}
function deleteNode(UUID){

	return new Promise(function(resolve,reject){
		neo4jService.executeCypher(
			/*then()*/
			function(result){
				console.log(`${JSON.stringify(result)}`);
				console.log(`Deleted:${result.summary.counters._stats.nodesDeleted}`);
				
				resolve(true);
			},
			/*catch()*/
			function (error) {
				console.log(`${error}`);
				reject(error);
			},
			/*name of cypher file*/
			"deleteNode.cyp",
			{UUID:UUID}
		);
	});
}
module.exports={getNodeTypes:getNodeTypes,
		getNodes:getNodes,
		getEdges:getEdges,
		addNodes:addNodes,
		deleteNode:deleteNode};