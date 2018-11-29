var express = require('express');
var router = express.Router(); 
var nodeSvc = require('./services/svc_entities');


router.route('/')
	.get(function(req,res){	
		nodeSvc.getEntityDefs()
			.then(function(result){res.json(result);})
			.catch(function(err){res.status(400).json({status:400,message:err});});
	})
	.post(function(req,res){
//		console.log(`${JSON.stringify(req.body.nodes)}`);
		const nodes = req.body.nodes;
		if(!nodes){
			res.status(400).json({status:400,message:"No nodes provided.",href:""});
		}else {
			if(!Array.isArray(nodes)){
				nodes = [nodes];
			}
			nodeSvc.addNodes(nodes)
				.then(function(result){res.json(result);})
				.catch(function(err){res.status(400).json({status:400,message:err});});
		}
	});
router.route('/:UUID')
	.delete(function(req,res){
		var UUID = req.params.UUID;
		nodeSvc.deleteNode(UUID)
			.then(function(result){
				res.sendStatus(204);
			})
			.catch(function(err){res.status(400).json({status:400,message:err});});
	})
	.put(function(req,res){
		var node = req.body.node;
//		console.log(`PUT.body: ${JSON.stringify(node)}`);
		nodeSvc.updateNode(node)
			.then(function(result){
				res.sendStatus(200);
			})
			.catch(function(err){res.status(400).json({status:400,message:err});});
	});
router.route('/type')
.get(function(req,res){		
	nodeSvc.getNodeTypes()
		.then(function(result){res.json(result);})
		.catch(function(err){res.status(400).json({status:400,message:err});});
});
module.exports=router;