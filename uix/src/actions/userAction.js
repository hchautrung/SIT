/* user sign in/out */
export const USER_SIGNIN_PENDING   = 'USER_SIGNIN_PENDING';
export const USER_SIGNIN_SUCCESS   = 'USER_SIGNIN_SUCCESS';
export const USER_SIGNIN_ERROR     = 'USER_SIGNIN_ERROR';
export const USER_SIGNOUT          = 'USER_SIGNOUT';
export const signIn = (username, password) => ({
    type: USER_SIGNIN_PENDING,
    data: {username, password}
});

/* sign out action will be passed directly to reducer, there is no listener in saga */
export const signOut = () => {
    localStorage.removeItem('userInfo');
    return {
        type: USER_SIGNOUT,
        data: null,
    }
};