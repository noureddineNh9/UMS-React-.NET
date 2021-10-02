import { applyMiddleware, compose, createStore  } from "redux";
import thunk from "redux-thunk";
import myReducer from "./reducers";

const InitialState = {
    list: []
}


const store = createStore( myReducer, InitialState ,
    compose(
        applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()        
    )
)

export default store;