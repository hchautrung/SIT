/* jshint node: true, esversion: 6, undef: true, unused: true, expr: true*/

"use strict";

var router = require("./router");
var Router = new router();
var MessageController = require("../controllers/MessageController");
const MessageService = require("../services/MessageService");

Router.add("post", "/", async (req, res) => {
	let  obj_return;
	try{
		obj_return = await MessageController.create(req.body);
	}
	catch(err){
		obj_return = err;
		res.status(404);
	}
	finally{
		res.send(obj_return);
	}
});

Router.add("get", "/", async (req, res) => {
	let  obj_return;
	try{
		obj_return = await MessageController.list(req.query);
	}
	catch(err){
		obj_return = err;
		res.status(404);
	}
	finally{
		res.send(obj_return);
	}
});

Router.add("get", "/offline", async (req, res) => {
	let  obj_return;
	try{
		obj_return = await MessageController.offline(req.query);
	}
	catch(err){
		obj_return = err;
		res.status(404);
	}
	finally{
		res.send(obj_return);
	}
});

Router.add("get", "/:id", async function(req, res){
	let  obj_return;
	try{
		obj_return = await MessageController.get(req.params.id);
	}
	catch(err){
		obj_return = err;
		res.status(404);
	}
	finally{
		res.send(obj_return);
	}
});

module.exports = Router.listen();