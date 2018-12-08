const neo4JSvc = require('../lib/Neo4jService');

const obj = {
        "Person": [],
        "Organisation": [
            { "name": "Established", "format": "dd/mm/yyyy", "type": "Date" },
            { "name": "Name", "length": { "low": 80, "high": 0 }, "type": "String" },
            { "name": "Address", "length": "multiline", "type": "String" }
        ]
    };

console.log(`${JSON.stringify(obj)}`);
const cleanObj=neo4JSvc.cleanObj(obj);
console.log(`${JSON.stringify(cleanObj)}`);