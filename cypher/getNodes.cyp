MATCH (n:Type)
WITH n,reduce(t=[], x IN labels(n) | t+ CASE WHEN x="Type" THEN [] ELSE [x] END) as type
OPTIONAL MATCH (n)--(l)
WITH n,type,size(collect(l))>0 as hasLinks
RETURN collect(n{.*,type:type,hasLinks}) as nodes