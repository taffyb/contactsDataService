MATCH (d:EntityDef)
OPTIONAL MATCH (d)-[:HAS_A]->(p:Property)-[:OF]->(t:PropertyType)
WITH d,collect(p {.*, type:t.name}) as properties
RETURN apoc.map.mergeList(collect(apoc.map.fromValues([d.name, properties])))  as entityDefs