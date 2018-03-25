const nodeSvc = require("./svc_nodes");

nodeSvc.addNode("Test")
	.then((uuid)=>{console.log(`${uuid}`);})
	.catch((err)=>{console.log(`${err}`);});