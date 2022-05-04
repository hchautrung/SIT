import axios from "axios";
import serviceUrl from '../constants/serviceUrl';

let source =  axios.CancelToken.source();

const axiosInstance = axios.create({
	source: source,
	baseURL: serviceUrl.baseURL,
	timeout: serviceUrl.timeout,
	headers: {
		'Access-Control-Allow-Origin': '*',
		"Content-Type": "application/json",
		//"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
	},
	responseType: "json",
});

/* Intercept request, response and error handler
 * ref: https://auralinna.blog/post/2019/global-http-request-and-response-handling-with-the-axios-interceptor
*/
const isHandlerEnabled = (config={}) => {
	return config.hasOwnProperty('handlerEnabled') && !config.handlerEnabled ? false : true
}

const requestHandler = (request) => {
	if (isHandlerEnabled(request)) {
        /* For instance, an authentication token could be injected into all requests
         * request.headers['token'] = localStorage.getItem('token')
        */
	}
	return request
}

const successHandler = (response) => {
	if (isHandlerEnabled(response.config)) {
		/* additional error handler, for instance add more data */
	}
	/* ignore data.data */
	return response.data
}

const errorHandler = (error) => {
	if (isHandlerEnabled(error.config)) {
		/* additional error handler, for instance add more data */
	}
	/* return Promise.reject({ ...error }); */
	/* if back-end send custom error then alter axios error message with custom message
	* ref: https://stackoverflow.com/questions/57839551/how-to-have-custom-error-code-check-for-axios-response-interceptor
	*/
	if (error.response.data && error.response.data.message) {
		let customError = new Error(error.response.data.message);
		error.original_status = error.status;
		error.status = error.response.data.statusCode;
		/* add some properties to make it look like a regular axios error */
		customError.response = error;
		customError.request = error.request;
		customError.config = error.config;
		customError.isAxiosError = true; // or not
	
		return Promise.reject(customError);
	}
	else
		return Promise.reject(error);
}

/* Enable interceptors */
axiosInstance.interceptors.request.use(request => requestHandler(request));
axiosInstance.interceptors.response.use(
	response => successHandler(response),
	error => errorHandler(error)
)

/* CREATE A WRAPPER TO BE USED SAGA, ref: https://dev.to/ajmal_hasan/axios-api-call-wrapper-with-redux-saga-46mj */
const api = (method, route, body = null, token = null, bearer = false) => {
    token && !bearer && (axiosInstance.defaults.headers.common['Authorization'] = token);
	token && bearer && (axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`);
    return axiosInstance({ method, url: route, data: body});
}

export default api;