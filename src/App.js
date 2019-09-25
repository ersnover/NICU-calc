import React from 'react';
import {connect} from 'react-redux'
import {Switch, Route} from 'react-router-dom'
import * as actionCreators from "./store/actionCreators"
import './css/mainpage.css'
import {Navbar} from './components/subcomponents/navbar'
import {Header} from './components/subcomponents/header'



const App = (props) => {
  return (
    <div>
      {props.isAuth ? 
        <Switch>
          <Route path="/main/babyView" component={null} />
          <Route path="/" component={Header} />
        </Switch> : null}
      {props.children}
      {props.isAuth ? <Navbar /> : null}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.isAuth,
    username: state.username,
    userId: state.userId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(actionCreators.signOut())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
