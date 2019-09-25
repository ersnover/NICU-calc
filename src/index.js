import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './components/login'
import * as serviceWorker from './serviceWorker';

import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {reducer} from './store/reducer'

import {BrowserRouter, Switch, Route} from 'react-router-dom'

import Authenticate from './components/requireAuth'
import {setAuthenticationHeader} from './utils/authenticate'

import AddBaby from './components/addBaby'
import MyBabies from './components/myBabies'
import Account from './components/account'
import BabyView from './components/babyView'


const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

let token = localStorage.getItem('jsonwebtoken')
setAuthenticationHeader(token)

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App>
                <Switch>
                    <Route exact path='/' component={Login} />
                    <Route exact path='/main' component={Authenticate(MyBabies)} />
                    <Route path='/main/babyView' component={Authenticate(BabyView)} />
                    <Route exact path='/main/addBaby' component={Authenticate(AddBaby)}/>
                    <Route exact path='/main/account' component={Authenticate(Account)} />
                </Switch>
            </App>
        </BrowserRouter>
    </Provider>, 
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
