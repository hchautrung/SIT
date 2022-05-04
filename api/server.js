var express = require('express');
var uuid = require("uuid");
var mongoose = require('mongoose');
var config = require("./config");

var app = express();
var router = express.Router(); 

var db = null;
mongoose.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1/sit', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    /*useCreateIndex: true,*/
})
.then(() => db = mongoose.connection)
.catch(err => console.log(err));

var path = require('path');
var cors = require('cors');
var favicon = require('serve-favicon');

/* enable json, form-encoded in post, CORS and serve favicon */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

/* configure route */
var router = express.Router(); 
require('./routes')(app, router);

/* set case or incase sensitve routing. */
app.set("case sensitive routing", config.case_sensitive);
/* set to use query parser to decode (internally uses querystring.unescape)  encoded-url in GET parameters */
app.set("query parser", "simple");
/* register all routes */
app.use(router);

/* server listen on port 8282. */
var server = app.listen(8282, function(){
	console.log("Listening on port 8282...");
});

/* handle clean up server and database process is terminated */
process.on('uncaughtException', function(err) {
    console.error('Uncaught exception ', err);
    shutdown();
});
 
process.on('SIGTERM', function () {
    console.log('Received SIGTERM');
    shutdown();
});
 
process.on('SIGINT', function () {
    console.log('Received SIGINT');
    shutdown();
});

function shutdown(){
	console.log('Shutting down ....');
	server.close(() => {
		console.log("Web server closed");
        db.close()
        .then(() => {
			console.log("Database closed");
		})
		.catch((err)=>{
			console.log(err);
		});
	});
}

/* Simple websocket to monitor client disconnect and push notification or replace MQTT if there is need */
const WebSocket = require('ws');
const UserController = require("./controllers/UserController")
const wss = new WebSocket.Server({ port: 8080 });

const clients = new Map();

wss.on('connection', ws => {
    const id = uuid.v4();
    const metadata = { client_id: id };
    clients.set(ws, metadata);

    ws.on('message', msg => {
      const message = JSON.parse(msg);
      const metadata = clients.get(ws);

      const action = message.action;

      switch(action){
        case "LINK":
            clients.set(ws, {client_id: metadata.client_id, user_id: message.user_id});
            console.log(`Connected ClientId ${metadata.client_id} with UserId ${message.user_id}`);
            break;
        case "UPDATE_LAST_VISITED_TIME":
            UserController.updateLastVisitedTime(message.user_id, message.last_time_read);
            break;
        default:
            break;
      }
    });

    ws.on("close", () => {
        const client = clients.get(ws);
        console.log("Disconnected from client", client.client_id)
        /* upadate last visited */
        client.user_id && UserController.updateLastVisitedTime(client.user_id, "");
        clients.delete(ws);
    });
});

