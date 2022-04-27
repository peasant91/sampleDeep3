import {get, post} from '../services/baseApi'

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

export const postReport = (data) => {
    return post(`v1/contract/report`, data)
}