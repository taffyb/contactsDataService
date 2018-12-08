//entity:{type:"",properties:{}}
//Example: entity:{type:"Person",properties:{name:"Suzannah"}}

MATCH (d:EntityDef{name:$entity.type})
CREATE (e:Entity)
	SET e=$entity.properties,
		e.GUID=apoc.create.uuid()
WITH d,e
CALL apoc.create.addLabels(e,[$entity.type]) YIELD node
WITH d,e
MERGE (e)-[:DEFINED_BY]->(d)
RETURN e.GUID as GUID

