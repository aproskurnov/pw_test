import * as React from "react";

import "./TransactionCreating.scss";

import {Form, Formik, FormikBag, FormikProps, FormikValues, withFormik, yupToFormErrors} from "formik";
import {Input} from "../Input/Input";
import {Button} from "../Button/Button";
import {Link, Redirect} from "react-router-dom";
import {IAuthAction, IRootReducer, ICreateTransactionData} from "../../actions/types";
import {Dispatch} from "redux";
import {updateBalanceAction} from "../../actions";
import {connect} from "react-redux";
import options from "../../options";
import * as Yup from "yup"

interface ITransactionCreatingForms {
    balance: number,
    handleSubmit: (values:FormikValues, params: FormikBag<ITransactionCreatingForms, ITransactionFormsProps>)=>void
}

interface ITransactionFormsProps {
    name: string,
    amount: string
}

const form = (props:FormikProps<FormikValues>) => {
    const {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue

    } = props;
    return (
        <form onSubmit={handleSubmit}>
            <div className="transaction-creating__field">
                <Input type={"text"} name={"name"} placeholder={"Name"}
                       onChange={(e)=>{handleChange(e);}}
                       onBlur={handleBlur}
                       value={values.name}
                       centered={true}
                       suggest={true}
                       setFieldValue={setFieldValue}
                />

                <div className="transaction-creating__error">
                    {errors.name}
                </div>
            </div>
            <div className="transaction-creating__field">
                <Input type={"number"} name={"amount"} placeholder={"Amount"}
                       onChange={handleChange}
                       onBlur={handleBlur}
                       value={values.amount}
                       centered={true}
                       numbers={true}
                       autoComplete={"off"}
                       setFieldValue={setFieldValue}
                />

                <div className="transaction-creating__error">
                    {errors.amount}
                </div>
            </div>
            <div className="transaction-creating__button">
                <Button text={"Make transaction"} disabled={isSubmitting}/>
            </div>
        </form>
    );
};

const TransactionCreatingForm = withFormik({
    mapPropsToValues: () => ({name:'', amount:''}),
    validate: (values, props:ITransactionCreatingForms)=>{

        if(!values.amount){
            values.amount = '0';
        }
        values.amount = (+values.amount).toString();
        const schema = Yup.object({
            name: Yup.string()
                .required('Name required'),
            amount: Yup.number()
                .max(props.balance, "Don't have enough money")
                .min(1, "Amount must be > 0")
                .required('Amount required')
        });

        return schema
            .validate(values, {abortEarly:false})
            .then(()=>{
            })
            .catch(err => {
                return yupToFormErrors(err);
            });
    },
    handleSubmit: (values, params) => {
        params.props.handleSubmit(values, params);
    },
    displayName: 'TransactionCreatingForm'
})(form);


interface IRegisterProps{

}

interface IRegisterState{

}

interface IStateProps{
    isAuthenticated: boolean,
    balance: number
}
interface IDispatchProps{
    updateBalance: (balance: number)=>void,
}

type Props = IRegisterProps & IStateProps & IDispatchProps;


export class TransactionCreating extends React.Component<Props, IRegisterState> {
    constructor(props:Props){
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }
    redirect(){
        if (this.props.isAuthenticated){
            return <Redirect to={"/"}/>;
        }
    }
    showNewTransaction(){
        if (this.props.isAuthenticated){
            return (
                <div className={"transaction-creating__wrapper"}>
                    <h2 className={"transaction-creating__title"}>New transaction</h2>
                    <TransactionCreatingForm balance={this.props.balance} handleSubmit={this.handleSubmit}/>
                </div>
            )
        }else{
            return (
                <div className={"transaction-creating__wrapper"}>
                    <h2>You need sign in for operations</h2>
                </div>
                );
        }
    }
    handleSubmit(values:FormikValues, { setErrors, setSubmitting, resetForm }: FormikBag<ITransactionCreatingForms, ITransactionFormsProps> ){
        let baseUrl = options.baseUrl;
        let url = new URL(baseUrl + '/api/protected/transactions');
        let token = localStorage.getItem('token');
        fetch(url.toString(), {
            mode:'cors',
            method: 'POST',
            body: JSON.stringify(values),
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
            .then((resp:{trans_token:ICreateTransactionData}|string)=>{
                if ((resp as {trans_token:ICreateTransactionData}).trans_token){
                    let data = (resp as {trans_token:ICreateTransactionData}).trans_token;
                    this.props.updateBalance(data.balance);
                    resetForm();
                    alert('Transaction is successful');
                }else{
                    let data = (resp as string);
                    setErrors({amount:data});

                }
                setSubmitting(false);
            }).catch(()=> {
            setSubmitting(false);
        });
    }
    render() {
        return (
            <div className="container container_big">
                <div className="transaction-creating">
                    {this.showNewTransaction()}
                </div>
            </div>
        );
    }
}


const mapStateToProps:(state:IRootReducer)=>IStateProps = (state)=>{
    return {
        isAuthenticated:state.auth.isAuthenticated,
        balance: state.auth.user ? state.auth.user.balance : null
    }
};

const mapDispatchToProps:(dispatch:Dispatch<IAuthAction>)=>IDispatchProps = (dispatch) => {
    return {
        updateBalance: (balance: number)=>dispatch(updateBalanceAction(balance)),
    }
};

export default connect<IStateProps, IDispatchProps, IRegisterProps>(mapStateToProps, mapDispatchToProps)(TransactionCreating);