//filter ={source:UUID,type:,start:}
MATCH (s)
WHERE s.UUID=$filter.source
WITH s
MATCH (n)
WHERE (NOT n.UUID=$filter.source) AND $filter.type IN labels(n) 
WITH s,n
OPTIONAL MATCH (s)-[r]-(n)
WITH n as target, collect({type:type(r),direction:(CASE WHEN startnode(r)=s THEN "from" ELSE "to" END),id:id(r)}) as types,(CASE WHEN NOT (r IS NULL) THEN true ELSE false END ) as related
ORDER by id(n)
RETURN collect({target:target.UUID ,types:types, related:related}) as links