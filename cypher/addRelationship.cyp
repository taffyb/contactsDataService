//rel:{fromGUID:"b3641b7e-bd2c-4957-b44a-fe115d166e35",type:"EMPLOYS",props:{},toGUID:"94a20359-ae87-4f2f-a81e-a0dc1df143e0"}

MATCH (from:Entity{GUID:$rel.fromGUID}),(to:Entity{GUID:$rel.toGUID})
CALL apoc.create.relationship(from,$rel.type,$rel.props,to) YIELD rel
RETURN true as success