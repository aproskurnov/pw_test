import {EActionType, IAuthAction, IUser, IUserAuth, IUserAuthData} from "./types"
import {Dispatch} from "redux";
import options from "../options";


export const loadUserInfo:any = () => (dispatch:Dispatch<IAuthAction>, getState:()=>IUserAuth) => {
    let baseUrl = options.baseUrl;
    let url = new URL(baseUrl + '/api/protected/user-info');

    let fetchFunc = (token:string)=>{
        fetch(url.toString(), {
            mode:'cors',
            headers: {
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
            .then((data:{user_info_token: IUser}|string)=>{
                if ((data as {user_info_token: IUser}).user_info_token){
                    dispatch(loadInfoAction((data as {user_info_token: IUser}).user_info_token));
                }else{
                    throw new Error(data as string);
                }

            }).catch(()=> {
                localStorage.removeItem('token');
                dispatch(loginFailAction());
            }
        );
    };

    let token = localStorage.getItem('token');
    if (token) {
        fetchFunc(token);
    }

};

export const loginAction = (data:IUserAuthData) => {
    localStorage.setItem('token', data.id_token);
    let action:IAuthAction = {
        type: EActionType.LOGIN_SUCCESS,
        data: data
    };
    return action;
};

export const registerAction = (data:IUserAuthData) => {
    localStorage.setItem('token', data.id_token);
    let action:IAuthAction = {
        type: EActionType.REGISTER_SUCCESS,
        data: data
    };
    return action;
};

export const loginFailAction = () => {
    let action:IAuthAction = {
            type: EActionType.LOGIN_FAILED,
        };
    return action;
};

export const registerFailAction = () => {
    let action:IAuthAction = {
        type: EActionType.REGISTER_FAILED,
    };
    return action;
};

export const logoutAction = () => {
    localStorage.removeItem('token');
    let action:IAuthAction = {
        type: EActionType.LOGOUT_SUCCESS,
    };
    return action;
};

export const loadInfoAction = (user:IUser) => {
    let action:IAuthAction = {
        type: EActionType.LOAD_INFO,
        user: user
    };
    return action;
};

export const updateBalanceAction = (balance:number)=>{
    let action:IAuthAction = {
        type: EActionType.UPDATE_BALANCE,
        balance: balance
    };
    return action;
};