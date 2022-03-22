import { get, post } from "./baseApi"

export const getFreshchat = () => {
    return get('v1/freshchat')
}

export const postFreshchat = (data) => {
    return post('v1/freshchat', data)
}