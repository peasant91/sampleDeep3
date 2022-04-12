import { get, post, patch } from "./baseApi"

export const getProfile = () => {
    return get('v1/driver/profile', {})
}

export const changePassword = (data) => {
    return post('v1/driver/new-password', data)
}

export const getUserBank = (id) => {
    return get(`v1/driver/company/${id}/bank`, {})
}

export const registerVehicle = (data) => {
    return post('v1/driver/vehicle', data)
}