import * as actions from '../actions/userAction';
const initialStateSignIn = {
    loading: false, 
    userInfo: null,
    error: false,
};

export const userSignInReducer = (state = initialStateSignIn, action) => {
    switch (action.type) {
        case actions.USER_SIGNIN_PENDING:
            return {...state, loading: true, error: false};
        case actions.USER_SIGNIN_SUCCESS:
            return {...state, userInfo:action.payload, loading: false, error: false};
        case actions.USER_SIGNIN_ERROR:
            return {...state, loading: false, error: action.payload};
        case actions.USER_SIGNOUT:
            return {};
        default:
            return state;
    }
}
