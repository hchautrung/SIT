import { createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

let enhancers;
if (process.env.NODE_ENV === 'development') {
    enhancers = compose(
        applyMiddleware(...middlewares),
        window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
    );
} else {
    enhancers = compose(
        applyMiddleware(...middlewares),
    );
}

const userInfo = localStorage.getItem('userInfo');
const initialStore = {
    userSignIn: {
        userInfo: userInfo ? JSON.parse(userInfo): null
    }
}

const store = createStore(rootReducer, initialStore, enhancers);
sagaMiddleware.run(rootSaga);

export default store;