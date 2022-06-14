import { get, getRaw } from "./baseApi"

export const getCampaignList = (query) => {
    return getRaw('v1/campaign', query)
}

export const getCampaignDetail = (id, query) => {
    return get(`v1/campaign/${id}`, query)
}