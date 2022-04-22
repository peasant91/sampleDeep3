import React from 'react'
import { View } from 'react-native'
import { get } from './baseApi'


export const getHome = () => {
    return get('v1/home', {})
}
