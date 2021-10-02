import React from 'react'

const InitialState = {
    modules : [],
    classes: []
}


export default function AdminReducer(state = InitialState, action) {
    
    switch (action.type) {
        case "GET_ALL_CLASSES":
            return {
                ...state,
                classes: action.data
            }
            
    
        default:
            return state;
    }

}
