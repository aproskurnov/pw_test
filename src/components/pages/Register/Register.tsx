import * as React from "react";

import "./Register.scss";

import {Form, Formik, FormikBag, FormikProps, FormikValues} from "formik";
import RegisterFormSchema from "../Register/RegisterFormSchema";
import {Input} from "../../Input/Input";
import {Button} from "../../Button/Button";
import {Link, Redirect} from "react-router-dom";
import {IAuthAction, IRootReducer, IUserAuth, IUserAuthData} from "../../../actions/types";
import {Dispatch} from "redux";
import {loadUserInfo, loginAction, registerAction, registerFailAction} from "../../../actions";
import {connect} from "react-redux";
import options from "../../../options";
import Header from "../../Header/Header";

interface IRegisterProps{

}

interface IRegisterState{

}

interface IStateProps{
    isAuthenticated: boolean
}
interface IDispatchProps{
    registerSuccess: (data: IUserAuthData)=>void,
    registerFail: ()=>void,
    loadUserInfo: ()=>void
}

type Props = IRegisterProps & IStateProps & IDispatchProps;


export class Register extends React.Component<Props, IRegisterState> {
    constructor(props:Props){
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }
    redirect(){
        if (this.props.isAuthenticated){
            return <Redirect to={"/"}/>;
        }
    }
    handleSubmit(values:FormikValues, { setErrors }: FormikBag<FormikProps<FormikValues>, FormikValues> ){
        let baseUrl = options.baseUrl;
        let url = new URL(baseUrl + '/users');
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
                    this.props.registerSuccess(data);
                    this.props.loadUserInfo();
                }else{
                    data = data as string;
                    this.props.registerFail();
                    setErrors({email:data});

                }
            }).catch(()=> {
                this.props.registerFail();
        });
    }
    render() {
        return (
            <div className="container container_big">
                {this.redirect()}
                <Header/>
                <div className="register">
                    <h2 className={"register__title"}>Registration</h2>
                    <Formik
                        initialValues={{username:"", email:"", password:"", password_confirmation:""}}
                        validationSchema={RegisterFormSchema}
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
                                <div className="register__field">
                                    <Input type={"text"} name={"username"} placeholder={"Name"}
                                           onChange={handleChange}
                                           onBlur={handleBlur}
                                           value={values.username}
                                           centered={true}
                                    />

                                    <div className="register__error">
                                        {errors.name}
                                    </div>
                                </div>
                                <div className="register__field">
                                    <Input type={"email"} name={"email"} placeholder={"Email"}
                                           onChange={handleChange}
                                           onBlur={handleBlur}
                                           value={values.email}
                                           centered={true}
                                    />

                                    <div className="register__error">
                                        {errors.email}
                                    </div>
                                </div>
                                <div className="register__field">
                                    <Input type={"password"} name={"password"} placeholder={"Password"}
                                           onChange={handleChange}
                                           onBlur={handleBlur}
                                           value={values.password}
                                           centered={true}
                                    />

                                    <div className="register__error">
                                        {errors.password}
                                    </div>
                                </div>
                                <div className="register__field">
                                    <Input type={"password"} name={"password_confirmation"} placeholder={"Password confirmation"}
                                           onChange={handleChange}
                                           onBlur={handleBlur}
                                           value={values.password_confirmation}
                                           centered={true}
                                    />

                                    <div className="register__error">
                                        {errors.password_confirmation}
                                    </div>
                                </div>
                                <div className="register__button">
                                    <Button text="Sign up" disabled={isSubmitting}/>
                                </div>
                                <div className="register__login-info">
                                    Do you have account? <Link to={"/login"}><span className="register__login-link">Sign in</span></Link>
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
        registerSuccess: (data: IUserAuthData) => dispatch(registerAction(data)),
        registerFail: ()=>dispatch(registerFailAction()),
        loadUserInfo: ()=>dispatch(loadUserInfo())
    }
};

export default connect<IStateProps, IDispatchProps, IRegisterProps>(mapStateToProps, mapDispatchToProps)(Register);