
import React from 'react';

const formReducer = (state, action) => {
    if (action.type === 'input') {
        const updatedValues = {
            ...state.inputValues,
            [action.id]: action.input
        }
        const updatedValidities = {
            ...state.inputValidities,
            [action.id]: action.isValid
        }
        let updatedFormIsValid = true
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
        }
        return {
            ...state,
            formIsValid: updatedFormIsValid,
            inputValues: updatedValues,
            inputValidities: updatedValidities
        }

    }

    if (action.type === 'picker') {
        const updatedValues = {
            ...state.inputValues,
            [action.id]: action.input,
            [action.id + '_value']: action.desc
        }
        const updatedValidities = {
            ...state.inputValidities,
            [action.id]: action.isValid
        }
        let updatedFormIsValid = true
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
        }
        return {
            ...state,
            formIsValid: updatedFormIsValid,
            inputValues: updatedValues,
            inputValidities: updatedValidities
        }

    }

    if (action.type === 'image') {
        const updatedValues = {
            ...state.inputValues,
            [action.id]: action.input,
            [action.id + '_uri']: action.uri
        }
        const updatedValidities = {
            ...state.inputValidities,
            [action.id]: action.isValid
        }
        let updatedFormIsValid = true
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
        }
        return {
            ...state,
            formIsValid: updatedFormIsValid,
            inputValues: updatedValues,
            inputValidities: updatedValidities
        }

    }

    if (action.type === 'update') {
        console.log('state push', action.state)
        return {
            ...action.state
        }
    }

    if (action.type === 'check') {
        return {
            ...state,
            isChecked: true
        }
    }

    return state
}

export default formReducer