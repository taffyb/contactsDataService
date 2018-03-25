MATCH (n:Type)
WITH reduce(t=[],l IN labels(n) | t+ (CASE WHEN (l <>"Type") THEN [l] ELSE [] END))  as type, keys(n) as keys
WITH type,filter(k in keys WHERE k<>"UUID") as keys
UNWIND keys as key
WITH DISTINCT type, key
WITH type,collect(key) as keys
RETURN collect({type:type,keys:keys}) as nodeTypes