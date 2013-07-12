var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  var fs = require('fs'); 
  response.send(fs.readFileSync("index.html"));
  console.log("writing index.html");
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
