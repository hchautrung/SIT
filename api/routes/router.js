function router() {
	var _obj_router = require('express').Router();
    var _arr_table = [],
    	_req = "requestType",
    	_url = "requestUrl",
    	_middleware = "middleWare"
    	_fn = "callbackFunction";

	/**
	* Add route.	
	*
	* @param {String} request_type Parameter can be get, post, put, delete.
	* @param {String} request_url Parameter url. For instance /auth.
	* @param {Function} callback Callback function.
	* @param {Function} middle_ware Middleware use in router.
	* 
	* @returns
	*/
	router.prototype.add = function add(request_type, request_url, callback, middle_ware){ // can replace router.prototype by this.
		var route = {};
		route[_req] = request_type;
		route[_url] = request_url;
		route[_fn] = callback;
		if(middle_ware) route[_middleware] = middle_ware;
		_arr_table.push(route);
	};

	/**
	* Listen on route.	
	*
	* @param
	* 
	* @returns
	*/
	router.prototype.listen = function listen(){ // can replace router.prototype by this.
		_arr_table.forEach(function (route) {
			if (route[_req] == 'get') {
			    _obj_router.get(route[_url], route[_fn]);
			}
			else if (route[_req] == 'post') {
				if(route[_middleware])
					_obj_router.route(route[_url]).post(route[_middleware], route[_fn]);
				else
			    	_obj_router.post(route[_url], route[_fn]);
			}
			else if (route[_req] == 'patch') {
			    _obj_router.patch(route[_url], route[_fn]);
			}
			else if (route[_req] == 'delete') {
			    _obj_router.delete(route[_url], route[_fn]);
			}
			else if (route[_req] == 'put'){
			    _obj_router.put(route[_url], route[_fn]);
			}
		});

		return _obj_router;
	};
}

module.exports = router;