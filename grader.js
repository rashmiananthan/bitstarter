#!/usr/bin/env node

var fs = require('fs');
var sys = require('util');
var program = require('commander');
var cheerio = require('cheerio');
var request = require('request');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var rest = require('restler');

var clone = function(fn){
    return fn.bind({});
};

var checkHtmlFile = function(htmlfile, checksfile){
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks){
       var present = $(checks[ii]).length > 0;
       out[checks[ii]] = present;	
    }
    return out;
};

var checkUrl = function(url, checksfile){
    rest.get(url).on('complete',function(data){
    $ = cheerio.load(data);	
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks){
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }	
     var outJson = JSON.stringify(out, null, 4);
    console.log(outJson);	
});
};

var cheerioHtmlFile = function(htmlfile){
  request(htmlfile, function(error,response,body){
  return cheerio.load(fs.readFileSync(body));
});
};

var loadChecks = function(checksfile){
    return JSON.parse(fs.readFileSync(checksfile));
};

var assertFileExists = function(infile){
    var instr = infile.toString();
    if(!fs.existsSync(instr)){
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1);
    }
    return instr;	
};

if(require.main == module) {

    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url>', 'Path to url')
        .parse(process.argv);

   if(program.url){
		checkUrl(program.url, program.checks);
    }else if(program.file){
	sys.puts("From file");
	var checkJson = checkHtmlFile(program.file, program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
    }else{
	console.log('Enter an url or a file name');
    } 
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
