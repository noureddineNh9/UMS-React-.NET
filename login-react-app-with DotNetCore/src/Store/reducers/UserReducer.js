import { LOGIN_SUCCESS, LOGIN_FIELD } from "../actions/types";

const InitialState = {
    isAuthenticated: false,
    user: {},
    token: null,
    Data: []
}


export default function UserReducer(state = InitialState, action){

    switch (action.type) {
        case "GET_DATA":
            return {
                ...state,
                Data : action.payload
            }

        default:
            return InitialState;
    }


}