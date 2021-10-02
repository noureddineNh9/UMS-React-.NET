import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect } from 'react'
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { useHistory, useNavigate } from "react-router-dom";
import UserContext from '../Context/UserContext';

const baseUrl = "http://localhost:21260/api/";

function LoginPage(props) {
    let navigate = useNavigate()

    const userContext = useContext(UserContext); 

    if(userContext.isAuth)
        navigate("/")
        
    const formik = useFormik({
        initialValues: {
            userName: 'student_2',
            password: 'Eddine_20'
        },
        onSubmit: values => {
            submitData(values);
        },
    });

    let submitData = (data) => {
    axios.post(baseUrl + "Users/Login", data )
    .then(response =>{   
        if(response.data !== "")
        {
            userContext.setUser(response.data)
            userContext.setisAuth(true)
            navigate("/")
            window.location.reload(false);
        }
        else {
            console.log("email or password is not valide");
       }
    })
    .catch(err => console.log(err))
    }



    return (
        <div>
            <div className="col-md-6 col-md-offset-3" >
                <h2>Login</h2>
                <form name="form" onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="userName">Username</label>
                        <input type="text" className="form-control" name="userName"             
                            onChange={formik.handleChange}
                            value={formik.values.userName} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" name="password"             
                            onChange={formik.handleChange}
                            value={formik.values.password}/>
                    </div>
                    <div className="form-group">
                        <input type="submit" className="btn btn-primary" />
                    </div>
                </form>

                <br /> <br/>

            </div>

        </div>
    )
}



export default LoginPage;
