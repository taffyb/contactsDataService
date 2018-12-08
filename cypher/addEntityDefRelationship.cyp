//rel:{fromName:"Organisation",type:"EMPLOYS",props:{},toName:"Person"}

MATCH (from:EntityDef{GUID:$rel.fromGUID}),(to:EntityDef{GUID:$rel.toGUID})
CALL apoc.create.relationship(from,$rel.type,$rel.props,to) YIELD rel
RETURN true as success    