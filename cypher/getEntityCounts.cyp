//:param entityType:null

MATCH (e:Entity)
WITH filter(l IN labels(e) WHERE l <>"Entity")[0] as type, count(e) as count
WHERE (NOT type IS NULL) AND (($entityType IS NULL) OR (type=$entityType))
WITH collect(apoc.map.fromValues([type,count])) as counts
RETURN apoc.map.mergeList(counts) as counts
//{
// Person:2,
// Organisation:1
//}

