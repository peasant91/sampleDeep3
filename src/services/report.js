import {get} from '../services/baseApi'

export const getReportList = (id) => {
    return get(`v1/contract/${id}/report`)
}

export const getReportDetail = (id) => {
    return get(`v1/contract/report/${id}`)
}

export const getChartData = (id) => {
    return get (`v1/contract/${id}/trip/graph`)
}