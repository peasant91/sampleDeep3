import React from 'react'
import { get, post } from "./baseApi"

export const getProjectList = () => {
    return get('/v1/project-list')
}

export const getProjectDetail = (id) => {
    return get(`/v1/project/${id}`)
}