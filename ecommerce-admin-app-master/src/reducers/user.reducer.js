import { userConstants } from "../actions/constants"
const initState = {
    error: null,
    message: '',
    loading: false,
    sentOTP: false,
    verifyOTP: false
}

export default (state = initState, action) => {
    console.log(action);
    switch (action.type) {
        case userConstants.GET_OTP_REQUEST:
            state = {
                ...state,
                loading: true,
            }
            break;
        case userConstants.GET_OTP_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: action.payload.message,
                sentOTP: true,
            }
            break;
        case userConstants.GET_OTP_FAILURE:
            state = {
                ...state,
                loading: false,
                error: action.payload.error,
                sentOTP: false
            }
            break;
        case userConstants.VERIFY_OTP_REQUEST:
            state = {
                ...state,
                loading: true
            }
            break;
        case userConstants.VERIFY_OTP_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: action.payload.message,
                verifyOTP: true
            }
            break;
        case userConstants.VERIFY_OTP_FAILURE:
            state = {
                ...state,
                loading: false,
                message: action.payload.message,
                verifyOTP: false
            }
            break;
    }

    return state;
}