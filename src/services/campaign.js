import { get } from "./baseApi"

export const getCampaignList = () => {
    return get('v1/campaign', {})
}

export const getCampaignDetail = (id, query) => {
    return get(`v1/campaign/${id}`, query)
}