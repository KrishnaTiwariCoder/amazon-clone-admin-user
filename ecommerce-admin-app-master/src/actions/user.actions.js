import { userConstants } from "./constants";
import axios from "../helpers/axios";

export const _SEND_OTP = (user) => {
    return dispatch => {
        dispatch({ type: userConstants.GET_OTP_REQUEST })

        axios.post(`/admin/getOTP`, {
            ...user
        })
            .then(res => {
                if (res.status === 201) {
                    dispatch({ type: userConstants.GET_OTP_SUCCESS, payload: { message: `OTP is send to +${user.phone}` } })
                } else {
                    dispatch({ type: userConstants.GET_OTP_FAILURE, payload: { message: res.data.error } })
                }
            })
            .catch(error => {
                dispatch({ type: userConstants.GET_OTP_FAILURE, payload: { message: error } })
            })
    }

}

export const _VERIFY_OTP = (data) => {
    return dispatch => {
        dispatch({ type: userConstants.VERIFY_OTP_REQUEST })

        axios.post(`/admin/verifyOTP`, {
            ...data
        })
            .then(res => {
                if (res.status === 200) {
                    dispatch({ type: userConstants.VERIFY_OTP_SUCCESS, payload: { message: res.message } })
                    window.location.href = '/signin';
                } else {
                    dispatch({ type: userConstants.VERIFY_OTP_FAILURE, payload: { message: res.data.error } })
                }
            })
            .catch(error => {
                dispatch({ type: userConstants.VERIFY_OTP_FAILURE, payload: { message: error } })
            })
    }
}