import * as React from "react";

import "./../../index.scss"

import {Route, Switch} from "react-router";
import {Home} from "../pages/Home/Home";
import Transactions from "../pages/Transactions/Transactions";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import {NoMatch} from "../pages/NoMatch/NoMatch";
import {BrowserRouter as Router} from "react-router-dom";
import {Provider} from "react-redux";
import store from '../../store';
import {loadUserInfo, loginAction} from "../../actions";
import Logout from "../pages/Logout/Logout";
import {IUserAuth} from "../../actions/types";

export class App extends React.Component<{}, {}> {
    constructor(props:{}){
        super(props);

    }
    componentDidMount(): void {
        let state:IUserAuth = store.getState().auth;
        if (state.isAuthenticated && state.user === null){
            store.dispatch(loadUserInfo());
        }
    }

    render(){
        return (
            <Provider store={store}>
                <Router>
                    <Switch>
                        <Route exact path="/">
                            <Home/>
                        </Route>
                        <Route path="/login">
                            <Login/>
                        </Route>
                        <Route path="/logout">
                            <Logout/>
                        </Route>
                        <Route path="/register">
                            <Register/>
                        </Route>
                        <Route path="/transactions">
                            <Transactions/>
                        </Route>
                        <Route path="*">
                            <NoMatch/>
                        </Route>
                    </Switch>
                </Router>
            </Provider>
        )
    }
}