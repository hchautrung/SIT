import * as actions from '../actions/socketAction';
const initialState = {
    payload: null, /* received payload from server */
    action: "", /* action name */
    is_connected: false,
    error: null, /* error message */
    ws: null /* socket object */
};

export const socketReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SOCKET_CONNECT_PENDING:
            return {...state, action: action.type, is_connected: false};
        case actions.SOCKET_CONNECT_SUCCESS:
            return {...state, ws: action.payload, is_connected: true, action: action.type};
        case actions.SOCKET_CONNECT_ERROR:
            return {...state, error: action.payload, is_connected: false, action: action.type};
        case actions.SOCKET_CONNECT_END:
            return {...initialState, action: action.type, is_connected: false};

        case actions.SOCKET_SENT_SUCCESS:
            return {...state, payload: action.payload, action: action.type};
        case actions.SOCKET_SENT_ERROR:
            return {...state, error: action.payload, action: action.type};

        case actions.SOCKET_RECEIVED_SUCCESS:
            return {...state, payload: action.payload, action: action.type};
        case actions.SOCKET_RECEIVED_ERROR:
            return {...state, error: action.payload, action: action.type};
        default:
            return state;
    }
}
