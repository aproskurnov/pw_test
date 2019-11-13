import {EActionType, IAuthAction, IUserAuth} from "../actions/types"

const initialState: IUserAuth = {
    token: localStorage.getItem('token'),
    isAuthenticated: Boolean(localStorage.getItem('token')),
    user: null
};

export const authReducer = ( state = initialState, action:IAuthAction )=>{

    switch (action.type) {
        case EActionType.LOGIN_SUCCESS:
        case EActionType.REGISTER_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                token: action.data.id_token,
            };
        case EActionType.LOGIN_FAILED:
        case EActionType.REGISTER_FAILED:
        case EActionType.LOGOUT_SUCCESS:
            return {
                ...state,
                isAuthenticated: false,
                token: null,
                user: null
            };
        case EActionType.LOAD_INFO:
            return {
                ...state,
                user:action.user
            };
        case EActionType.UPDATE_BALANCE:
            return {
                ...state,
                user:{
                    ...state.user,
                    balance:action.balance
                }
            };
        default:
            return state;

    }
};