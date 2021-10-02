import React from 'react';


const InitialState = {
    emails:[],
    professors: [{id: 0}],
    students: []
}

export default function EmailReducer(state = InitialState, action) {

    switch (action.type) {
        case "GET_ALL_EMAIL":
            return {
                ...state,
                emails : action.data
            }
    
        case "GET_ALL_PROFESSOR":
            return {
                ...state,
                professors : action.data
            }
    
        case "GET_ALL_STUDENT":
            return {
                ...state,
                students : action.data
            }
        case "SEND_EMAIL":
            return {
                ...state,
                emails : [
                    ...state.emails,
                    action.data
                ]
            }               
        default:
            return state;
    }

}



