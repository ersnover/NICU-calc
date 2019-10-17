import React, {useState} from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import '../css/login.css'
import axios from 'axios'
import {setAuthenticationHeader} from '../utils/authenticate'
import * as env from '../env'
import * as actionCreators from '../store/actionCreators'

const Login = (props) => {

    const [logReg, setLogReg] = useState('login')
    const [error, setError] = useState("")

    const [loginUser, setLoginUser] = useState({username: "", password: ""})
    const [registerUser, setRegisterUser] = useState({username: "", password: "", password2: ""})

    const toggleState = () => {
        logReg === 'login' ? setLogReg('register') : setLogReg('login')
    }

    const handleLoginChange = (e) => {
        setLoginUser({
            ...loginUser,
            [e.target.name]: e.target.value
        })
    }

    const handleLoginSubmit = () => {
        axios.post(`${env.serverUrl}/u/login`, loginUser)
        .then(res => {
            if (res.data.token) {
                localStorage.setItem('jsonwebtoken',res.data.token)
                setAuthenticationHeader(res.data.token)
                props.setAuthState(res.data)
                // set redux state
            } else if (res.data.error) {
                setError(res.data.error)
            } else {
                setError('Login error. Please try again')
            }
        })
    }

    const renderLogin = () => {
        return (
            <div className="loginDiv">
                <h1 className="login">Welcome Back!</h1>
                <h3>Guest Username: ccuster<br/>Guest Password: chicago1</h3>
                <div className="loginInputDiv">
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" onChange={(e) => handleLoginChange(e)} />
                </div>
                <div className="loginInputDiv">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" onChange={(e) => handleLoginChange(e)} />
                </div>
                <div className="loginButtonsDiv">
                    <button className="submitButton login" onClick={handleLoginSubmit}>Log In</button>
                    <button className="toggleButton login" onClick={toggleState}>Register new account</button>
                </div>
                <span className="errorSpan">{error}</span>
            </div>
        )
    }

    const handleRegisterChange = (e) => {
        setRegisterUser({
            ...registerUser,
            [e.target.name]: e.target.value
        })
    }

    const handleRegisterSubmit = () => {
        if (registerUser.username.length < 5) {
            setError("Username needs to be at least 5 characters")
        } else if (registerUser.password !== registerUser.password2) {
            setError("Passwords don't match!")
        } else {
            axios.post(`${env.serverUrl}/u/register`, registerUser)
            .then(res => {
                if  (res.data.token) {
                    localStorage.setItem('jsonwebtoken',res.data.token)
                    setAuthenticationHeader(res.data.token)
                    props.setAuthState(res.data)
                } else if (res.data.error) {
                    setError(res.data.error)
                } else {
                    setError('Could not register user. Please try again')
                }
            })
        }
    }

    const renderRegister = () => {
        return (
            <div className="loginDiv">
                <h1 className="login">Let's get you set up.</h1>
                <div className="loginInputDiv">
                    <label htmlFor="username">Make a username:</label>
                    <input type="text" name="username" onChange={(e) => handleRegisterChange(e)} />
                </div>
                <div className="loginInputDiv">
                    <label htmlFor="password">Create a password:</label>
                    <input type="password" name="password" onChange={(e) => handleRegisterChange(e)} />
                </div>
                <div className="loginInputDiv">
                    <label htmlFor="password2">Re-enter your password:</label>
                    <input type="password" name="password2" onChange={(e) => handleRegisterChange(e)} />
                    <span className="errorSpan">Password must be at least 7 characters</span>
                </div>
                <div className="loginButtonsDiv">
                    <button className="submitButton login" onClick={handleRegisterSubmit}>Register</button>
                    <button className="toggleButton login" onClick={toggleState}>Log in existing account</button>
                    <span className="errorSpan">{error}</span>
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            {props.isAuth ? <Redirect to="/main" /> : null}
            {logReg === 'login' ? renderLogin() : renderRegister()}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        isAuth: state.isAuth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setAuthState: token => dispatch(actionCreators.setAuthState(token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)