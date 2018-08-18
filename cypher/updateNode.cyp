MATCH (t:Type{UUID:$node.UUID})
SET t=$node 
RETURN t as node