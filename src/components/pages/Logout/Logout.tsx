import * as React from "react";

import {logoutAction} from "../../../actions";
import { Redirect } from 'react-router-dom'
import {connect} from 'react-redux'
import {IAuthAction, IRootReducer, IUserAuth} from "../../../actions/types";
import {Dispatch} from "redux";

interface ILogoutProps{

}

interface ILogoutState{

}

interface IStateProps{
    isAuthenticated: boolean
}
interface IDispatchProps{
    logout: ()=>void
}

type Props = ILogoutProps & IStateProps & IDispatchProps;


class Logout extends React.Component<Props, ILogoutState> {
    constructor(props:Props){
        super(props);

    }
    process(){
        if (!this.props.isAuthenticated){
            return <Redirect to={"/"}/>;
        }else{
            this.props.logout();
            return <div/>
        }
    }
    render() {
        return (
            <div className="container container_big">
                {this.process()}
            </div>
        );
    }
}

const mapStateToProps:(state:IRootReducer)=>IStateProps = (state)=>{
    return {
        isAuthenticated:state.auth.isAuthenticated
    }
};

const mapDispatchToProps:(dispatch:Dispatch<IAuthAction>)=>IDispatchProps = (dispatch) => {
    return {
        logout: ()=>dispatch(logoutAction())
    }
};

export default connect<IStateProps, IDispatchProps, ILogoutProps>(mapStateToProps, mapDispatchToProps)(Logout);