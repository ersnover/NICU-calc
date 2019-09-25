import React from 'react'

const Account = (props) => {
    return (
        <div className="pageComponent">
            <button onClick={() => {props.signOut()}}>Sign Out</button>
        </div>
    )
}

export default Account