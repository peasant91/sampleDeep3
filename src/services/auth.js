import React from 'react'
import { post } from './baseApi'

export const login = (data) => {
    return post('v1/login', data)
}

export const register = (data) => {
    return post('v1/register', data)
}

export const logout = (data) => {
    return get('v1/logout', data)
}

export const forgotPassword = (data) => {
    return post('v1/password/email', data)
}

export const verifyOtp = ({code, otpId}) => {
    return post('v1/otp/verify', {code: code, otp_id: otpId})
}

export const sendOtp = (data) => {
    return post('v1/otp/send', data)
}