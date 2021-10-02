import { GET_DATA } from "../actions/types";

const InitialState = {
    Data: [{"init":"1"}]
}


export default function SecretReducer(state = InitialState, action){

    switch (action.type) {
        case "GETATA":
            return {
                ...state,
                Data : action.payload
            }
    
        default:
            return InitialState;
    }
}