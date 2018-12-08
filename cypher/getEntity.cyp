// filter:{GUID:null,entityType:null}

// filter:{entityType:"Person"}
// filter:{GUID:"b3641b7e-bd2c-4957-b44a-fe115d166e35"}

MATCH (e:Entity)
WHERE (NOT $filter IS NULL) AND (($filter.GUID IS NULL) OR (e.GUID = $filter.GUID))
WITH e,filter(l IN labels(e) WHERE l <>"Entity")[0] as type, properties(e) as details
WHERE (NOT $filter IS NULL) AND (($filter.entityType IS NULL) OR (type=$filter.entityType))
OPTIONAL MATCH (e)-[from_rels]->(n)
WITH e,from_rels,n,type,details
WHERE NOT "EntityDef" IN labels(n) 
WITH e,type,apoc.map.merge(details,apoc.map.fromValues(["from_rels",(CASE WHEN n.GUID IS NULL THEN [] ELSE  collect({type:type(from_rels),to:n.GUID})END)])) as details
OPTIONAL MATCH (e)<-[to_rels]-(n)
WITH e,to_rels,n,type,details
WHERE n IS NULL OR NOT "EntityDef" IN labels(n) 
WITH type ,apoc.map.merge(details,apoc.map.fromValues(["to_rels",(CASE WHEN n.GUID IS NULL THEN [] ELSE  collect({type:type(to_rels),from:n.GUID}) END)])) as details
WITH apoc.map.fromValues([type,collect(details)]) as entities
WITH collect(entities) as entityList
RETURN apoc.map.mergeList(entityList) as entities