var path = require('path');
var fs = require("fs");
var Validator = require('jsonschema').Validator;
  var v = new Validator();
	
function readSchemaFromFile(schemaname){
	var file = path.join( __dirname, '../schema',schemaname+"_schema.json");
	return fs.readFileSync(file, "utf8");
}

function validate(json,schema){
	var type=readSchemaFromFile(schema);
	type = JSON.parse(type);
	return v.validate(json,type);
}

module.exports ={
	validate: validate
};