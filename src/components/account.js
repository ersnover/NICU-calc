import React from 'react'
import * as actionCreators from '../store/actionCreators'

const Account = (props) => {
    return (
        <div className="pageComponent">
            <button className="signOutButton" onClick={() => {props.signOut()}}>Sign Out</button>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => dispatch(actionCreators.signOut())
    }
}

export default Account