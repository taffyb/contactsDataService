var path = require('path');
var fs = require("fs");
	
function readCypherFromFile(filename){
	var file;

	file = path.join( __dirname, '../cypher',filename);
	if(!file.endsWith(".cyp")){
		file +=".cyp";
	}	
	 
//	console.log(`Filename: ${file}`);
	var cypher=fs.readFileSync(file, "utf8");
	return cypher;
}

function replaceTokens(text,values){
	
	for(token in values){
		text = text.replace('__('+token+')__',values[token]);
	}
	return text;
}

module.exports ={
	loadCypher: readCypherFromFile,
	replaceTokens: replaceTokens
};