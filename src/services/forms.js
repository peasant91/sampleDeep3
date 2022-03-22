import { get, post } from "./baseApi"

export const getQuiz = () => {
    return get('v1/monthly-quiz', {})
}

export const sendQuiz = (data) => {
    return post('v1/monthly-quiz', data)
}

export const sendSaving = (data) => {
    return post('v1/new-pb-saving', data)
}

export const sendQuestion = (data) => {
    return post('v1/question-and-answer', data)
}

export const sendSchedule= (data) => {
    return post('v1/presentation-schedule', data)
}