import React, { useState, useEffect } from 'react'
import axios from "axios"
import { createApiEndpoint } from "../Api";


const defaultImageSrc = '/img/ImagePlaceholder.png'

const initialFieldValues = {
    id: 0,
    userName: '',
    firstName: '',
    lastName: '',
    password: '',
    email: 'aaaa@mail.com',
    imageName: '',
    imageSrc: defaultImageSrc,
    imageFile: null
}

export default function RegisterStudent() {
    const [values, setValues] = useState(initialFieldValues)
    const [errors, setErrors] = useState({})

    const sendDataToApi = (formData) => {
        axios.post("http://localhost:21260/api/Users/RegisterStudent",formData )
            .then(res => {
                console.log(res.data);
            })
            .catch(err => console.log(err))


    }




    const handleInputChange = e => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        })
    }

    const showPreview = e => {
        if (e.target.files && e.target.files[0]) {
            let imageFile = e.target.files[0];
            const reader = new FileReader();
            reader.onload = x => {
                setValues({
                    ...values,
                    imageFile,
                    imageSrc: x.target.result
                })
            }
            reader.readAsDataURL(imageFile)
        }
        else {
            setValues({
                ...values,
                imageFile: null,
                imageSrc: defaultImageSrc
            })
        }
    }

    const validate = () => {
        let temp = {}
        temp.employeeName = values.employeeName == "" ? false : true;
        temp.imageSrc = values.imageSrc == defaultImageSrc ? false : true;
        setErrors(temp)
        return Object.values(temp).every(x => x == true)
    }

    const resetForm = () => {
        setValues(initialFieldValues)
        document.getElementById('image-uploader').value = null;
        setErrors({})
    }

    const handleFormSubmit = e => {
        e.preventDefault()
        if (true) {
            console.log(values);
            const formData = new FormData()
            formData.append('id', values.id)
            formData.append('userName', values.userName)
            formData.append('password', values.password)
            formData.append('firstName', values.firstName)
            formData.append('lastName', values.lastName)
            formData.append('email', values.email)
            formData.append('imageName', values.imageName)
            formData.append('imageFile', values.imageFile)
            sendDataToApi(formData)
        }
    }

    const applyErrorClass = field => ((field in errors && errors[field] == false) ? ' invalid-field' : '')


    return (
        <>
            <div className="container text-center">
                <p className="lead">An Employee</p>
            </div>
            <form autoComplete="off" noValidate onSubmit={handleFormSubmit}>
                <div className="card">
                    <img src={values.imageSrc} className="card-img-top" style={{width:"300px"}} />
                    <div className="card-body">
                        <div className="form-group">
                            <input type="file" accept="image/*" className={"form-control-file" }
                                onChange={showPreview} id="image-uploader" />
                        </div>
                        <div className="form-group">
                            <label >UserName</label>
                            <input className={"form-control" } placeholder="userName" name="userName"
                                value={values.userName}
                                onChange={handleInputChange} />
                        </div>
                        <label >first name</label>
                        <div className="form-group">
                            <input className="form-control" placeholder="firstName" name="firstName"
                                value={values.firstName}
                                onChange={handleInputChange} />
                        </div>       
                        <label >last name</label>
                 
                        <div className="form-group">
                            <input className={"form-control" } placeholder="lastName" name="lastName"
                                value={values.lastName}
                                onChange={handleInputChange} />
                        </div>
                        <label >Email</label>

                        <div className="form-group">
                            <input className="form-control" placeholder="email" name="email"
                                value={values.email}
                                onChange={handleInputChange} />
                        </div>
                        <label >password</label>
                        <div className="form-group">
                            <input className="form-control" placeholder="password" name="password"
                                value={values.password}
                                onChange={handleInputChange} />
                        </div>       

                        <div className="form-group text-center">
                            <button type="submit" className="btn btn-light">Submit</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

