
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

    if (action.type === 'update') {
        return {
            ...state,
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