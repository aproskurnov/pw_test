import * as React from "react";

import "./Transactions.scss"

import Header from "../../Header/Header";
import options from "../../../options";
import {IAuthAction, IRootReducer, IUserAuthData} from "../../../actions/types";
import {Dispatch} from "redux";
import {loadUserInfo, loginAction, loginFailAction} from "../../../actions";
import {connect} from "react-redux";
import {Redirect} from "react-router";

interface ITransactionData{
    id: number,
    date: string,
    username: string,
    amount: number,
    balance: number
}

interface ITransactionsState{
    transactions:ITransactionData[]
}

interface ITransactionsProps{

}

interface IStateProps{
    isAuthenticated: boolean
}
interface IDispatchProps{
}

type Props = ITransactionsProps & IStateProps & IDispatchProps;

export class Transactions extends React.Component<Props, ITransactionsState> {
    constructor(props:Props) {
        super(props);

        this.state = {transactions:[]}

    }
    componentDidMount(): void {
        if (this.props.isAuthenticated){
            let baseUrl = options.baseUrl;
            let url = new URL(baseUrl + '/api/protected/transactions');
            let token = localStorage.getItem('token');
            fetch(url.toString(), {
                mode:'cors',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
                .then((response)=>{
                    if (response.status === 200){
                        return response.json();
                    }else{
                        return response.text();
                    }

                })
                .then((resp:{trans_token:ITransactionData[]|string})=>{
                    let data = resp.trans_token;
                    if (Array.isArray(data)){
                        data = (data as ITransactionData[]);
                        this.setState({transactions:data})
                    }
                }).catch(()=> {
            });
        }
    }

    renderTransactions(){
        let transactions:JSX.Element[] = [];
        this.state.transactions.map((v)=>{
            let product = (
                <div className="transactions__row" key={v.id}>
                    <div className="transactions__cell">{v.date}</div>
                    <div className="transactions__cell">{v.username}</div>
                    <div className="transactions__cell">{v.amount}</div>
                    <div className="transactions__cell">{v.balance}</div>
                </div>
            );
            transactions.push(product);
        });
        return transactions;
    }
    redirect(){
        if (!this.props.isAuthenticated){
            return <Redirect to={"/"}/>;
        }
    }
    render() {
        return (
            <div className="container container_big">
                {this.redirect()}
                <Header/>
                <div className="transactions">
                    <div className="transactions__title">
                        <h2>Transactions</h2>
                    </div>
                    <div className="transactions__header">
                        <div className="transactions__cell">
                            date
                        </div>
                        <div className="transactions__cell">
                            name
                        </div>
                        <div className="transactions__cell">
                            amount
                        </div>
                        <div className="transactions__cell">
                            balance
                        </div>
                    </div>
                    <div className="transactions__body">
                        {this.renderTransactions()}
                    </div>
                </div>
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
    }
};

export default connect<IStateProps, IDispatchProps, ITransactionsProps>(mapStateToProps, mapDispatchToProps)(Transactions);