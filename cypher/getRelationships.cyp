MATCH (from:EntityDef)-[r]->(to:EntityDef)
WITH from,r,to
ORDER by from.name,to.name
RETURN collect({relationship:type(r),from:from.name,to:to.name}) as relationships