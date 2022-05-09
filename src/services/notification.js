import { get } from "./baseApi"

export const getNotification = (query) => {
    return get('v1/notification', query)
}