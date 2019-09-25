
const initialState = {
    isAuth: true,
    docId: 2,
    username: "ccuster"

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