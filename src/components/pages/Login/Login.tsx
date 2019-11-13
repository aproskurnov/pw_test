import * as React from "react";

import "./Login.scss";

import {Formik, Form, FormikBag, FormikValues, FormikProps} from "formik"
import LoginFormSchema from "./LoginFormSchema";
import {Input} from "../../Input/Input";
import {Button} from "../../Button/Button";
import {Link} from "react-router-dom";
import {loadUserInfo, loginAction, loginFailAction} from "../../../actions";
import { Redirect } from 'react-router-dom'
import {connect} from 'react-redux'
import {IAuthAction, IRootReducer, IUserAuthData} from "../../../actions/types";
import {Dispatch} from "redux";

import options from "../../../options";
import Header from "../../Header/Header";

interface ILoginProps{

}

interface ILoginState{

}

interface IStateProps{
    isAuthenticated: boolean
}
interface IDispatchProps{
    loginSuccess: (data: IUserAuthData)=>void,
    loginFail: ()=>void,
    loadUserInfo: ()=>void
}

type Props = ILoginProps & IStateProps & IDispatchProps;


class Login extends React.Component<Props, ILoginState> {
    constructor(props:Props){
        super(props);

        this.handleSubmit=this.handleSubmit.bind(this);
    }
    handleSubmit(values:FormikValues, { setErrors }: FormikBag<FormikProps<FormikValues>, FormikValues> ){

        let baseUrl = options.baseUrl;
        let url = new URL(baseUrl + '/sessions/create');
        fetch(url.toString(), {
            mode:'cors',
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response)=>{
                if (response.status === 201){
                    return response.json();
                }else{
                    return response.text();
                }

            })
            .then((data:IUserAuthData|string)=>{
                if ((data as IUserAuthData).id_token){
                    data = data as IUserAuthData;
                    this.props.loginSuccess(data);
                    this.props.loadUserInfo();
                }else{
                    data = data as string;
                    this.props.loginFail();
                    setErrors({'password':data});
                }
            }).catch((error)=> {
                this.props.loginFail();
        });
    }
    redirect(){
        if (this.props.isAuthenticated){
            return <Redirect to={"/"}/>;
        }
    }
    render() {
        return (
            <div className="container container_big">
                {this.redirect()}
                <Header/>
                <div className="login">
                    <h2 className={"login__title"}>Login</h2>
                    <Formik
                        initialValues={{email:"", password:""}}
                        validationSchema={LoginFormSchema}
                        onSubmit={this.handleSubmit}
                    >
                        {({
                              values,
                              errors,
                              isSubmitting,
                              handleChange,
                              handleBlur

                          })=>(
                            <Form>
                                <div className="login__field">
                                    <Input type={"email"} name={"email"} placeholder={"Email"}
                                           onChange={handleChange}
                                           onBlur={handleBlur}
                                           value={values.email}
                                           centered={true}
                                    />

                                    <div className="login__error">
                                        {errors.email}
                                    </div>
                                </div>
                                <div className="login__field">
                                    <Input type={"password"} name={"password"} placeholder={"Password"}
                                           onChange={handleChange}
                                           onBlur={handleBlur}
                                           value={values.password}
                                           centered={true}
                                    />

                                    <div className="login__error">
                                        {errors.password}
                                    </div>
                                </div>
                                <div className="login__button">
                                    <Button text="Login" disabled={isSubmitting}/>
                                </div>
                                <div className="login__register-info">
                                    Don't have account? <Link to={"/register"}><span className="login__register-link">Sign up</span></Link>
                                </div>
                            </Form>
                        )}
                    </Formik>
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
        loginSuccess: (data: IUserAuthData) => dispatch(loginAction(data)),
        loginFail: ()=>dispatch(loginFailAction()),
        loadUserInfo: ()=>dispatch(loadUserInfo())
    }
};

export default connect<IStateProps, IDispatchProps, ILoginProps>(mapStateToProps, mapDispatchToProps)(Login);