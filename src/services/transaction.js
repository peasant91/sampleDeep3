import { get, post } from "./baseApi"

export const getIncomeList = (query) => {
    return get('v1/transaction/history', query)
}

export const createWithdraw = () => {
    return post('v1/transaction/withdraw')
}