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

export const getColor = () => {
    return get(`${Config.apiVersion}/color`, {})
}

export const getCompanies = () => {
    return get(`${Config.apiVersion}/driver/company`, {})
}

export const getVehicleType = () => {
    return get(`${Config.apiVersion}/driver/vehicle/type`, {})
}

export const getVehicleBrand = (data) => {
    return get(`${Config.apiVersion}/driver/vehicle/brand`, data)
}

export const getVehicleModel = (data) => {
    return get(`${Config.apiVersion}/driver/vehicle/model`, data)
}

export const getVehicleOwnership = () => {
    return get(`${Config.apiVersion}/enum/vehicle-ownership`, {})
}

export const getVehicleSticker = () => {
    return get(`${Config.apiVersion}/enum/vehicle-sticker`, {})
}

export const getVehicleUsage = () => {
    return get(`${Config.apiVersion}/enum/vehicle-usage`, {})
}