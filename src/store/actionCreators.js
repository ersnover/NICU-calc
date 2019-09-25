export const setAuthState = user => {
    return {
        type: 'SET_AUTH',
        payload: user
    }
}

export const signOut = () => {
    return {
        type: 'SIGN_OUT'
    }
}