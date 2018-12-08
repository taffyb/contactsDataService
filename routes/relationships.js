var express = require('express');
var router = express.Router(); 
var relSvc = require('./services/svc_relationships');

router.route('/')
	.post(function(req,res){
		const relationships=req.body.rels;
		const results = [];
		
		relationships.forEach((rel)=>{
			results.push(relSvc.addRelationship(rel));				
		});	
		
		Promise.all(results)
			.then((result)=>{res.json(result);})
			.catch((err)=>{res.status(400).json({status:400,message:err});});
	});
module.exports=router;