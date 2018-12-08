var express = require('express');
var router = express.Router(); 
var entitySvc = require('./services/svc_entities');
var relSvc = require('./services/svc_relationships');

router.route('/')
	.get((req,res)=>{	
		entitySvc.getEntityDefs()
			.then((result)=>{res.json(result);})
			.catch((err)=>{res.status(400).json({status:400,message:err});});
	})
	.post(async (req,res)=>{	
		const entityDef=req.body.entityDef;
		const results = [];
		
		//Add the entity and save its GUID
		const GUID = await entitySvc.newEntityDef(entityDef);
		
		//If the entity has relationships add each 
		if(entityDef.from_rels.length>0){
			entityDef.from_rels.forEach((f)=>{
				results.push(relSvc.addRelationship({fromGUID:GUID,type:f.type,props:f.props,toGUID:f.GUID},true));				
			});			
		}
		if(entityDef.to_rels.length>0){
			entityDef.to_rels.forEach((f)=>{
				results.push(relSvc.addRelationship({fromGUID:f.GUID,type:f.type,props:f.props,toGUID:GUID},true));
			});
		}
		
		//once all relationships have been added return the new entity GUID
		Promise.all(results)
			.then(function(result){res.json(GUID);})
			.catch(function(err){res.status(400).json({status:400,message:err});});
	});

module.exports=router;