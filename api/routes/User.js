/* jshint node: true, esversion: 6, undef: true, unused: true, expr: true*/

"use strict";

var router = require("./router");
var Router = new router();
var UserController = require("../controllers/UserController");

/**
* @fileOverview User RESTful APIs. Please check {@link User}.
* @author Huynh Chau Trung <hchautrung@yahoo.com>
* @version 0.1
*/

Router.add("get", "/seed", async (req, res) => {
	let  obj_return;
	try{
		obj_return = await UserController.seed();
	}
	catch(err){
		obj_return = err;
		res.status(404);
	}
	finally{
		res.send(obj_return);
	}
});

Router.add("post", "/auth", async (req, res) => {
	let  obj_return;
	try{
		obj_return = await UserController.auth(req.body);
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
		obj_return = await UserController.get(req.params.id)
	}
	catch(err){
		obj_return = err;
		res.status(404);
	}
	finally{
		res.send(obj_return);
	}
});

Router.add("post", "/register", async (req, res) => {
	let  obj_return;
	try{
		obj_return = await UserController.create(req.body);
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