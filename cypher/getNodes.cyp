MATCH (n:Type)
WITH n,reduce(t=[], x IN labels(n) | t+ CASE WHEN x="Type" THEN [] ELSE [x] END) as type
RETURN collect(n{.*,type:type}) as nodes
