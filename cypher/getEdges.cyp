MATCH (from)-[r]->(to)
RETURN collect({id:id(r),source:from.UUID,target:to.UUID,type:type(r)}) as edges