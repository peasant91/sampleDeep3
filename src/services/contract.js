import { get, post } from "./baseApi"

export const applyContract = (id) => {
    return post('/v1/contract', {campaign_id: id})
}

export const getContractHistory = (query) => {
    return get('/v1/contract', query)
}

export const getContract = (id) => {
    return get(`/v1/contract/${id}/active`)
}


export const sendDistance = (data) => {
    return post ('v1/contract/trip', data)
}