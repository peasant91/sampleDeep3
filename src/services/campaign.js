import { get } from "./baseApi"

export const getCampaignList = (query) => {
    return get('v1/campaign', query)
}

export const getCampaignDetail = (id, query) => {
    return get(`v1/campaign/${id}`, query)
}