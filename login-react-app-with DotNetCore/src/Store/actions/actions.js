import { GET_DATA, LOGIN_SUCCESS } from "./types";
import api from "../../Api";
import axios from "axios";
import { Redirect } from "react-router";
import { useHistory } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../../Context/UserContext";
import { useDispatch } from "react-redux";

const baseUrl = "http://localhost:21260/api/";

export const getData = (token) => dispatch => {
    console.log(token)
    let config = {
        headers: {
          'Authorization': 'Bearer ' + token
        }
    }

    axios.get(baseUrl + "WeatherForecast", config)
    .then(response =>{
        dispatch({
            type: GET_DATA,
            payload: response.data
        })
    })
    .catch(err => console.log(err))
    

}

export const login = data => dispatch => {


    console.log(data)
    axios.post(baseUrl + "Users/Login", data )
    .then(response =>{   
        console.log(response)          
        if(response.data !== "")
        {

            dispatch({
                type: LOGIN_SUCCESS,
                payload: response.data
            })
        }
        else {
            console.log("email or password is not valide");
       }
    })
    .catch(err => console.log(err))

}

export const SendEmail = values => {
    
    console.log(("sdfsdf"));
    axios.post(baseUrl + "Mails", values )
    .then(response =>{   
        console.log(response)

    })
    .catch(err => console.log(err))

}