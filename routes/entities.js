var express = require('express');
var router = express.Router(); 
var entitySvc = require('./services/svc_entities');
var relSvc = require('./services/svc_relationships');

router.route('/')
	.get(function(req,res){	
		const filter = {};
		entitySvc.getEntites(filter)
			.then(function(result){res.json(result);})
			.catch(function(err){res.status(400).json({status:400,message:err});});
	})
	.post( async function(req,res){
		const entity=req.body.entity;
		const results = [];
		
		//Add the entity and save its GUID
		const GUID = await entitySvc.addEntity(entity);
		
		//If the entity has relationships add each 
		if(entity.from_rels.length>0){
			entity.from_rels.forEach((f)=>{
				results.push(relSvc.addRelationship({fromGUID:GUID,type:f.type,props:f.props,toGUID:f.GUID}));				
			});			
		}
		if(entity.to_rels.length>0){
			entity.to_rels.forEach((f)=>{
				results.push(relSvc.addRelationship({fromGUID:f.GUID,type:f.type,props:f.props,toGUID:GUID}));
			});
		}
		
		//once all relationships have been added return the new entity GUID
		Promise.all(results)
			.then(function(result){res.json(GUID);})
			.catch(function(err){res.status(400).json({status:400,message:err});});
	});
//Return Entities filtered by Type or GUID
router.route('/:filter')
	.get(function(req,res){	
		let filter = {};
		if("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(req.params.filter[0]) ){
			//filter starts with a Capital letter so is an Entity Type 
			filter={entityType:req.params.filter};
		}else{
			filter={GUID:req.params.filter};
		}
		entitySvc.getEntites(filter)
			.then(function(result){res.json(result);})
			.catch(function(err){res.status(400).json({status:400,message:err});});
	})
	.delete(function(req,res){
		var UUID = req.params.filter;

	})
	.put(function(req,res){
		var UUID = req.params.filter;
		var node = req.body.node;

	});
module.exports=router;