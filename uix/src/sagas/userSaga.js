import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../utils/api';
import * as actions from '../actions/userAction';

/* signin saga */
function* signIn (action) {
    try {
        const {username, password} = action.data;
        /* can replace action.data with {username, password}
        * but want to make its clear so use {username, password}
        */ 
        const response = yield call(api, "POST", `User/auth`, {username, password});
        yield put({type: actions.USER_SIGNIN_SUCCESS, payload: response.data});
        localStorage.setItem('userInfo', JSON.stringify(response.data));
    }
    catch(error) {
        yield put({type: actions.USER_SIGNIN_ERROR, payload:  error.message ?  error.message : error});
    }
}
export const signInSaga = function* () {
    yield takeLatest(actions.USER_SIGNIN_PENDING, signIn);
}