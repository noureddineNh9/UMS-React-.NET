import React, { useState, useEffect, useContext } from 'react'
import axios from "axios"
import { createApiEndpoint } from "../Api";
import UserContext from '../Context/UserContext';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import UserFormInfo from './UserFormInfo';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import $ from "jquery"



export default function Prifile(props) {
    const [values, setValues] = useState(null)
    const [errors, setErrors] = useState({})
    const userContext = useContext(UserContext); 

    useEffect(()=>{
        if(userContext.User.id !== 0)
        {
            setValues(userContext.User)
            console.log("rep");
        }
    }, [userContext.User])

    useEffect(()=>{
       console.log(values)
    }, [values])


    const updateImage = (formData) => {
        axios.post("http://localhost:21260/api/Student/updateImage",formData )
            .then(res => {
                console.log(res.data);
                userContext.setUser({
                    ...userContext.User,
                    imageSrc: res.data
                })
                console.log(userContext);

            })
            .catch(err => console.log(err))
    }

    const editIamgeBtn =() => {
        $("#image-uploader").click();
    }
    


    const showPreview = e => {
        if (e.target.files && e.target.files[0]) {
            let imageFile = e.target.files[0];

            const formData = new FormData()
            formData.append('userId', userContext.User.id)
            formData.append('imageFile', imageFile)
            updateImage(formData)

        }

    }

    return (
        <>
                <div className="card">
                    <div className="card-body">
                    {
                        values !== null ? 
                        <>
                            <div className="row">
                                <div className="col-4 mx-auto text-center">
                                    <img src={userContext.User.imageSrc} className="card-img-top" style={{width:"300px"}} />
                                    <input type="file" accept="image/*" 
                                        onChange={showPreview} id="image-uploader" hidden />
                                </div>
                            </div>
                            <div className="row" >
                                <div className="col-3 mx-auto text-right">
                                    <Button  onClick={editIamgeBtn} ><EditOutlinedIcon /></Button>
                                </div>
                            </div>
                            <br/>
                            <UserFormInfo userInfo={userContext.User} /> 
                        </>
                        : <p>loadding ...</p>
                    }
                    </div>
                </div>
        </>
    )
}
