var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var server = http.createServer();
var extensions = {
	"html" : "text/html",
	"css" : "text/css",
	"js" : "application/javascript",
	"json" : "application/javascript",
	"png" : "image/png",
	"gif" : "image/gif",
	"jpg" : "image/jpeg"
};
var mimeType = "";

server.on('request', function(req,res) { 

	var requestPath = url.parse(req.url).pathname;

	if( requestPath === '/'){
		var page = path.join(__dirname, 'public',requestPath, 'index.html');
		mimeType = "html";
	}else{
		var page = path.join(__dirname, 'public',requestPath);
		var type = requestPath.split(".");
		mimeType = type[1];
		mimeType = extensions[mimeType];
	}

	fs.readFile(page, function (error, data) {
		if(error){
			res.writeHead(404);
			res.end();
		}else{
			res.writeHead(200,{"Content-type" : mimeType});
			res.end(data);
		}
	});

});

server.listen(3000);


