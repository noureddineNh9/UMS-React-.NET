import { Button, TextField } from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';
import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../Context/UserContext';



const validationSchema = yup.object({
    email: yup
      .string('Enter your email')
      .email('Enter a valid email')
      .required('Email is required'),
    password: yup
      .string('Enter your password')
      .min(8, 'Password should be of minimum 8 characters length')
      .required('Password is required'),
  });

  
  const initialValues = {
    id: 0,
    userName: 'user_1',
    firstName: 'ffff',
    lastName: 'llll',
    password: '',
    email: 'aaaa@mail.com',
    imageName: '',
    imageFile: null
}


export default function UserFormInfo(props) {

    useEffect(()=>{

    }, [])




    const formik = useFormik({
        initialValues: props.userInfo,
        validationSchema: validationSchema,
        onSubmit: (values) => {
          alert(JSON.stringify(values, null, 2));
        },
      });



    return (
        <form onSubmit={formik.handleSubmit}>
        <div className="row" >
            <div className="col-4">
                <TextField
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                margin="normal" 
                fullWidth
                />

            </div>
            <div className="col-4">
                <TextField
                  id="firstName"
                  name="firstName"
                  label="FirstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  margin="normal" 
                  fullWidth
                />

            </div>
            <div className="col-4">
                <TextField
                  id="lastName"
                  name="lastName"
                  label="LastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  margin="normal" 
                  fullWidth
                />
            </div>
        </div>
        
        
        <Button color="primary" variant="contained" type="submit">
        Submit
        </Button>
    </form>

    )
}
