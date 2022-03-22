
import React from 'react'
import { get, post } from "./baseApi"

export const getSettings = () => {
    return get('v1/setting')
}