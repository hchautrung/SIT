import { combineReducers } from 'redux';
import { userSignInReducer } from './userReducer';
import { socketReducer } from './socketReducer';

const rootReducer = combineReducers({
    userSignIn: userSignInReducer,
    socket: socketReducer,
});

export default rootReducer;