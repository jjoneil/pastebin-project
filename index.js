// * Upon saving the text, the user should be sent to a new page, which contains the text (hint: you may want to template the text into the page using string replacement. Or, use document.location to retrieve the ID of the text on the frontend and AJAX the text into the page -- up to you).

//   * Example. I save some text, and the site sends me to `localhost:8080/abcde`. If I share that link with someone, they can load up `localhost:8080/abcde` and it will show the text that I saved.

//   * If a user loads up a page with a text id that does not exist, they should be redirected to the homepage
  
//   * No need to implement login/auth unless you want to. If you do, you can allow logged in users to edit their own uploads.



var express = require("express");

var app = express();

var MongoClient = require("mongodb").MongoClient;
var db;
MongoClient.connect("mongodb://localhost", function(err, database){
	if(err){
		return console.log(err);
	}
	db = database;
	app.listen(8080, function(){
	console.log("Server started!");
	});
});

var messages = [];

//set up req.body
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}))

app.get("/", function(req, res){
	res.sendFile(__dirname + "/index.html");
});

app.get("/chat", function(req, res){
	console.log("hello!")
	db.collection("chats").find({}).toArray(function(err, data) {
		res.send(JSON.stringify(data))
		document.location = "/chat" + res;
	})
	
});

app.post("/chat", function(req, res){
	if(req.body.message){
		//messages.push(req.body.message);
		db.collection("chats").insertOne(req.body.message, function(err, doc){
			if (err) {
				console.log(err)
			} 
			res.send(doc.ops[0]._id);
		});
	} else{
		res.send("error");
	}
});



app.use(function(err, req, res, next){
	console.log(err);
	res.status(404);
	res.send("404 File Not Found");
});

app.use(function(err, req, res, next){
	console.log(err);
	res.status(500);
	res.send("500 Internal Server Error");
});