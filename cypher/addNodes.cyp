UNWIND $nodes as node
CREATE (n:Type)
	SET n=node.properties,n.UUID=apoc.create.uuid()
WITH n,node
CALL apoc.create.addLabels(n,[node.type]) YIELD node as newNode
RETURN collect({type:node.type,properties:node.properties,UUID:newNode.UUID}) as nodes