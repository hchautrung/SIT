import { eventChannel } from 'redux-saga';
import { select, call, put, take, takeLatest } from 'redux-saga/effects';
import * as actions from '../actions/socketAction';

function initialize (action) {
    return eventChannel(emitter => {
        const url = action.data;
        const ws = new WebSocket(url);

        ws.onopen = () => {
            return emitter({ type: actions.SOCKET_CONNECT_SUCCESS, payload: ws });
        }   
        ws.onerror = (error) => {
            return emitter({ type: actions.SOCKET_CONNECT_ERROR, payload: error.message ?  error.message : error });
        }
        ws.onmessage = (e) => {
            let msg = null
            try {
                msg = JSON.parse(e.data);
                return emitter({ type: actions.SOCKET_RECEIVED_SUCCESS, payload: msg });
            } catch(e) {
                return emitter({ type: actions.SOCKET_RECEIVED_ERROR, payload: e.data });
            }
        }

        /* unsubscribe function */
        return () => {
            return emitter({ type: actions.SOCKET_CONNECT_END, payload: null });
        }
    })
}

function* connect(action) {
    const channel = yield call(initialize, action);
    while (true) {
        const action = yield take(channel);
        yield put(action);
    }
}
export const connectSaga = function* () {
    yield takeLatest(actions.SOCKET_CONNECT_PENDING, connect);
}

function* send(action) {
    try{
        const {ws} = yield select(state => state.socket);
        ws.send(action.data);
        yield put({ type: actions.SOCKET_SENT_SUCCESS, payload: action.data });
    }
    catch(err){
        yield put({ type: actions.SOCKET_SENT_ERROR, payload: err });
    }
}
export const sendSaga = function* () {
    yield takeLatest(actions.SOCKET_SENT_PENDING, send);
}
