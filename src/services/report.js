import {get, post, patch} from '../services/baseApi'

export const getReportList = (id) => {
    return get(`v1/contract/${id}/report`)
}

export const getReportDetail = (id) => {
    return get(`v1/contract/report/${id}`)
}

export const getChartData = (id) => {
    return get (`v1/contract/${id}/trip/graph`)
}

export const getTripDetail =  (id) => {
    return get (`v1/contract/${id}/trip`)
}

export const postReport = (id,data) => {
    return patch(`v1/contract/report/${id}`, data)
}

export const postReportImage = (id, data) => {
    return post(`v1/contract/report/${id}/image`, data)
}

export const patchReportImage = (id, imageId,data) => {
    return patch(`v1/contract/report/${id}/image/${imageId}`, data)
}

export const getReportExample = () => {
    return get(`v1/report/example`)
}
