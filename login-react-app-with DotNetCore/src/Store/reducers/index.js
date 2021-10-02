import { combineReducers } from "redux";
import EmailReducer from "./EmailReducer"
import AdminReducer from "./AdminReducer"
import AuthReducer from "./AuthReducer"

export default combineReducers({EmailReducer, AdminReducer, AuthReducer})