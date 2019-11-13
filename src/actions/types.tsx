export interface IUser{
    id: number,
    name: string,
    email: string,
    balance: number
}

export interface IUserAuth {
    token: string,
    isAuthenticated: boolean,
    user: IUser
}

export interface IUserAuthData {
    id_token: string,
}

export interface ICreateTransactionData {
    id: number,
    date: string,
    username: string,
    amount: number,
    balance: number
}

export interface IAuthAction {
    type: EActionType,
    data?: IUserAuthData,
    user?: IUser,
    balance?: number
}

export enum EActionType {
    LOGIN_SUCCESS = "LOGIN_SUCCESS",
    LOGOUT_SUCCESS = "LOGOUT_SUCCESS",
    LOGIN_FAILED = "LOGIN_FAILED",
    REGISTER_SUCCESS = "REGISTER_SUCCESS",
    REGISTER_FAILED = "REGISTER_FAILED",
    LOAD_INFO = "LOAD_INFO",
    UPDATE_BALANCE="UPDATE_BALANCE"
}


export interface IRootReducer {
    auth: IUserAuth,
}