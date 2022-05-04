import {fork} from 'redux-saga/effects';
import { connectSaga, sendSaga } from './socketSaga';
import { signInSaga } from './userSaga';

export default function* rootSaga() {
	yield fork(connectSaga);
	yield fork(signInSaga);
	yield fork(sendSaga);
}