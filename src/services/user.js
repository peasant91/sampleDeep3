import { get, post, patch } from "./baseApi"

export const getProfile = () => {
    return get('v1/driver/profile', {})
}

export const updateProfile = (data) => {
    return patch('v1/user/profile', data)
}

export const changePassword = (data) => {
    return post('v1/driver/new-password', data)
}