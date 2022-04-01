import React from 'react'
import Config from '../constants/Config'
import { get } from './baseApi'

export const getProvince = (param) => {
    return get(`${Config.apiVersion}/region/province`, param)
}

export const getCity = (id) => {
    return get(`${Config.apiVersion}/region/city`, {province_id: id})
}

export const getDistrict = (id) => {
    return get(`${Config.apiVersion}/region/district`, {city_id: id})
}

export const getVillage = (id) => {
    return get(`${Config.apiVersion}/region/village`, {district_id: id})
}

export const getGender = () => {
    return get(`${Config.apiVersion}/enum/gender`, {})
}

export const getBank = () => {
    return get(`${Config.apiVersion}/bank`, {})
}

export const getCompanies = () => {
    return get(`${Config.apiVersion}/driver/company`, {})
}