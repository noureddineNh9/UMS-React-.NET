import React from 'react'

const InitialState = {
    Professor: {id: 0}
}


export default function AuthReducer(state = InitialState, action) {
    
    switch (action.type) {
        case "SET_INFO":
            return {
                ...state,
                Professor: action.data
            }
            
    
        default:
            return state;
    }

}
