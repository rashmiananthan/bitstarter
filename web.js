var express = require('express');

var fs = require('fs');

var app = express.createServer(express.logger());

var input = String(fs.readFileSync('/home/ubuntu/bitstarter/index.html','utf8',function(err,data){
  if(err){
     return console.log(err);
  }
  console.log(data);
}));


var buf = new Buffer(input);

app.get('/', function(request, response) {
  response.send(buf.toString());
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
