import { get } from "./baseApi"

export const getIncomeList = (query) => {
    return get('v1/transaction/history', query)
}