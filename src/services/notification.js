import { get, patch } from "./baseApi"

export const getNotification = (query) => {
    return get('v1/notification', query)
}

export const readNotif = (id) => {
    return patch(`v1/notification/${id}/read`)
}