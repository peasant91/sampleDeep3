import {get} from '../services/baseApi'

export const getReportList = (id) => {
    get(`v1/contract/${id}/report`)
}

export const getReportDetail = (id) => {
    get(`v1/contract/report/${id}`)
}