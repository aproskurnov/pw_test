import * as React from "react";
import './Header.scss';

import {Link} from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { faList } from '@fortawesome/free-solid-svg-icons'

import {IAuthAction, IRootReducer} from "../../actions/types";
import {Dispatch} from "redux";
import {connect} from "react-redux";

interface IHeaderProps {
}

interface IStateProps{
    isAuthenticated: boolean,
    balance: number
}

interface IDispatchProps{
}

type Props = IHeaderProps & IStateProps & IDispatchProps;


class Header extends React.Component<Props, {}> {
    constructor(props:Props){
        super(props);
    }
    showUser(){
        if (!this.props.isAuthenticated){
            return (
                <Link to="/login">
                    <FontAwesomeIcon icon={faUser} size="2x" />
                </Link>
            );
        }else{
            return (
                <Link to="/logout">
                    <FontAwesomeIcon icon={faSignOutAlt} size="2x" />
                </Link>
            );
        }
    }
    render() {
        return (
            <header className="header">
                <Link to="/">
                    <h2>PW</h2>
                </Link>
                <nav className="header__interface">
                    <div className="header__ico">
                        {this.showUser()}
                    </div>
                    <div className="header__ico">
                        <Link to="/transactions">
                            <FontAwesomeIcon icon={faList} size="2x" />
                        </Link>
                    </div>
                    <div className="header__ico">{this.props.balance}</div>
                </nav>
            </header>
        );
    }
}

const mapStateToProps:(state:IRootReducer)=>IStateProps = (state)=>{
    return {
        isAuthenticated: state.auth.isAuthenticated,
        balance: state.auth.user ? state.auth.user.balance : null
    }
};

const mapDispatchToProps:(dispatch:Dispatch<IAuthAction>)=>IDispatchProps = () => {
    return {

    }
};

export default connect<IStateProps, IDispatchProps, IHeaderProps>(mapStateToProps, mapDispatchToProps)(Header);