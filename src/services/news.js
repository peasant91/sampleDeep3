import { get, post } from "./baseApi"

export const getNews = (page) => {
    return get('v1/news', page)
}

export const getNewsDetail = (id) => {
    return get(`v1/news/${id}`)
}

export const postComment = (data) => {
    return post(`v1/news/comment`, data)
}