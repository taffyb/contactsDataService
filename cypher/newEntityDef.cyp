//entityDef:{name:,properties:[{}]}

MERGE (def:EntityDef{name:$entityDef.name})
	ON CREATE SET def.GUID=apoc.create.uuid()
FOREACH(p IN $entityDef.properties |
	MERGE (def)-[:HAS_A]->(prop:Property{name:p.name})
	SET prop=p
	REMOVE prop.type
	MERGE (prop)-[:OF]->(:PropertyType{name:p.type})
)
RETURN def.GUID as success