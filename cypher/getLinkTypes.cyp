MATCH (s)
WHERE s.UUID = $filter.source 
WITH s
MATCH (s)-[r]-(t)
WHERE t.UUID = $filter.target
RETURN type(r) as type, (CASE WHEN startnode(r)=s THEN "from" ELSE "to" END) as direction
