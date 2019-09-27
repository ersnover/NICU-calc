
const initialState = {
    isAuth: false,
    docId: "",
    username: ""

}

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_AUTH':
            return {
                ...state,
                isAuth: action.payload.token ? true : false,
                docId: action.payload.userid,
                username: action.payload.username
            }
        case 'SIGN_OUT':
            return {
                ...state,
                isAuth: false,
                docId: "",
                username: ""
            }
        default:
            return state
    }
}