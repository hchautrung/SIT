var config = require("../config");
var token = require("../modules/util/token");

var router = function(app, router) {
	var _obj_fs = require('graceful-fs'),
		_obj_path = require('path'),
		_obj_route = {};

    var _arr_valid_type = ['js'],
    	_arr_ignore_file = ['index.js', 'router.js'],
    	_arr_ignore_route = [];

	/**
	* Synchronously recurses a directory and it's subdirectories, returning
	* an array of files found with the '.js' extension. Path seperators will
	* be normalized to forward slashes.
	*
	* E.g. fn('./startDir') => [{ 'dirA/dirB/module1', ...]
	*
	* @param {String} dir Directory need to be scanned to get all file name without extension .js.
	* 
	* @returns {Array} module paths
	*/
	function _listModules(dir) {
		var files = _obj_fs.readdirSync(dir);
		var arr_module_path = [];
		var obj_stat, str_module_path, str_file_path;
	  
		files.forEach(function (fileName) {
			str_file_path = _obj_path.join(dir, fileName);
			obj_stat = _obj_fs.statSync(str_file_path);  
			// skip files
			if(_arr_ignore_file.indexOf(fileName) !== -1) return;
			// skip unknown filetypes
			if(_arr_valid_type.indexOf(fileName.split('.').pop()) === -1) return;
			/* build route name to distingush case sentiste or incasensitive */
			let route = _obj_path.basename(fileName, ".js"),
				entity = route;
			if(!config.app.case_sensitive) route = route.toLowerCase();
			_obj_route[route] = entity.toLowerCase();

			if (obj_stat.isFile() && _obj_path.extname(fileName) === '.js') {      
				str_module_path = str_file_path.slice(0, -3).replace(/\\/g, '/');
				arr_module_path.push(str_module_path);
			} else if (obj_stat.isDirectory()) {
				arr_module_path = arr_module_path.concat(_listModules(str_file_path));      
			}
	    
		});
	  
		return arr_module_path;
	}

	/**
	* Mounts all of the routes defined in a directory, using the module paths
	* to dictate the mount path. All '.js' files in the directory should be
	* modules that export an Express.Router().
	*
	* @param {String} dir Directory need to be scanned to get all modules.
	* 
	* @returns
	*/
	function _useModules(dir){
		var arr_module_path = _listModules(dir);
		var str_normalized_module_path = _obj_path.normalize(dir).replace(/\\/g, '/');
		var routePath;
		var str_resolved_module_path;

		arr_module_path.forEach(function (module_path) {
			routePath = module_path.replace(str_normalized_module_path, '');
			str_resolved_module_path = _obj_path.resolve(process.cwd(), module_path);
			app.use(routePath, require(str_resolved_module_path)); // app object from function constructor
		});
	}

	/**
	* Middle layer to preprocess client's request parameters before passing to server or respoding to client.	
	*
	* @param {Object} req 		- Request object. For instances</br>
	* <pre>
	*							  req.url: return path and query
	*							  req.path: return path only without query parameter
	*							  req.query: retrun query in JSON object.
	* </pre>
	* @param {Object} res 		- Response object.
	* @param {Function}	Next 	- Next excution function.
	* 
	* @returns
	*/
	app.use(function (req, res, next) {
		Promise.resolve()
		.then(()=>{
			next();
		})
		.catch(err=>{
			/* handle exception route without token */
			let arrURLPart = req.path.split('/'),
				controller = (typeof arrURLPart[1] !== 'undefined' && arrURLPart[1] !== '') ? arrURLPart[1] : '/';

			if(_arr_ignore_route.indexOf(controller) !== -1){
				if(err.error === 1){ // token is missing
					err.error = 0;
					err.status = err.statusCode = 200;
					err.message = "";
					next();
				}
				else{
					err.error += 1000;
					res.statusCode = err.status;
					res.send(err);
				}
			}
			else {
				//next();
				err.error += 1000;
				res.statusCode = err.status;
				res.send(err);
			}
		});
		
		/*	After calling corresponding routes for instance User.
			Modify response before sending.
		*/
		var send = res.send;
		res.send = function(data){
			if(data && data.fn && !config.app.debug) delete data.fn;
			send.call(this, data);
		};
	});

	/**
	* handle route loading.
	*/
	_useModules(__dirname);
	
	/**
	* Handle routes are not found in loaded routes.
	*
	* @param {Object} req Request object.
	*	req.url: return path and query
	*	req.path: return path only without query parameter
	*	req.query: retrun query in JSON object.
	* @param {Object} res Response object.
	* 
	* @returns
	*/
	router.use(function (req, res){ // router object from function's constructure
		res.json({app_name: "Tackit", app_des: "Tackit's Backend API: route '" + req.path + "'not found."});
	});
};
module.exports = router;