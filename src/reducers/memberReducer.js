
import React from 'react';

const memberReducer = (state, action) => {

    if (action.type === 'input') {
        const updatedMembers = { ...state.inputValues }
        const members = [...updatedMembers.members]
        members[action.index] = action.input
        updatedMembers.members = members

        const updatedValidities = { ...state.inputValidities }
        const membersValidities = [...updatedValidities.members]
        membersValidities[action.index] = action.isValid
        updatedValidities.members = membersValidities

        var updatedFormIsValid = true
        console.log('member validities', membersValidities)

        for (var i=0; i<updatedMembers.members.length; i++) {
            updatedFormIsValid = updatedFormIsValid && membersValidities[i]
            console.log('updated', updatedFormIsValid)
        }

        console.log('isvalid', updatedFormIsValid)

        return {
            ...state,
            inputValues: updatedMembers,
            inputValidities: updatedValidities,
            formIsValid: updatedFormIsValid,
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

    if (action.type === 'addMember') {
        const updatedMembers = { ...state.inputValues }
        const members = [...updatedMembers.members]
        members.push({
            name: '',
            nrp: ''
        })
        updatedMembers.members = members

        return  { 
            ...state,
            inputValues: updatedMembers
        }
    }

    return state
}

export default memberReducer