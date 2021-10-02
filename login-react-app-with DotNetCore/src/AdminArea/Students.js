import { Avatar, Box, Button, Card, CardHeader, Divider, Grid,
     Table, TableBody, TableCell, TableHead, TableRow, TextField, Button as MuiButton, makeStyles, Select, FormControl, MenuItem, InputLabel } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { createApiEndpoint, ENDPOINTS } from "../Api";
import Popup from '../layouts/Popup';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import Input from '../Controls/Input';
import SendIcon from '@material-ui/icons/Send';
import { useDispatch, useSelector } from 'react-redux';

const defaultImageSrc = '/img/ImagePlaceholder.png'

const initialValues = {
    id: 0,
    userName: 'user_1',
    firstName: '',
    lastName: '',
    password: '',
    email: 'aaaa@mail.com',
    imageName: '',
    imageSrc: defaultImageSrc,
    imageFile: null,
    classeId: 0
}

const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
  }));


export default function Students() {
    const [StudentList, setStudentList] = useState([])
    const [studentId, setstudentId] = useState(0)
    const [PopupVisibility, setPopupVisibility] = useState(false);
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({})


    const Classes = useSelector(state => state.AdminReducer.classes)

    const classes = useStyles();

    useEffect(()=> {
        if(studentId !== 0 )
        {        
            axios.get("http://localhost:21260/api/Student/" + studentId)
            .then(res => {
                setValues(res.data)
                setPopupVisibility(true)
            })
            .catch(err => console.log(err))
        }
        
    }, [studentId])

    useEffect(()=> {
        createApiEndpoint("Student/getAll").fetchAll()
        .then(res => {
            setStudentList(res.data)
        })

    }, [])
    console.log(Classes);


    const AddOrEdit = (formData, onSuccess) => {
        if(formData.get('id') == "0")
        {
            createApiEndpoint("Student/Register").create(formData)
            .then(res => {
                console.log(res.data);
                let newlist = StudentList.concat([res.data])
                setStudentList(newlist);
                onSuccess()
            })
            .catch(err => console.log(err))
        }
        else{
            createApiEndpoint("Student").update(formData.get('id'), formData)
            .then(res => {
                resetForm()
                setPopupVisibility(false)
                console.log(res.data);
                let newlist = StudentList.map( item => {
                    if(item.id === formData.get('id')) return res.data
                    else return item ;
                } )
                setStudentList(newlist)
            }).catch(err => console.log(err))
        }

    }

    const UpdateBtnClick = id => {
        setstudentId(id);
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


    const validateForm = () => {
        console.log(errors);
        let temp = {};
        temp.userName = values.userName !== "" ? "" : "This field is required.";
        temp.email = values.email !== "" ? "" : "This field is required.";
        temp.password = values.password !== "" ? "" : "This field is required.";
        temp.classeId = values.classeId !== "0" ? "" : "This field is required.";
        setErrors({ ...temp });
        return Object.values(temp).every(x => x === "");
    }
    

    const resetForm = () => {
        setValues(initialValues)
        document.getElementById('image-uploader').value = null;
        setErrors({})
        setstudentId(0)
        setPopupVisibility(false)
    }

    const handleFormSubmit = e => {
        console.log(values);
        e.preventDefault()
        if (validateForm()) {
            
            const formData = new FormData()
            formData.append('id', values.id)
            formData.append('userName', values.userName)
            formData.append('password', values.password)
            formData.append('firstName', values.firstName)
            formData.append('lastName', values.lastName)
            formData.append('email', values.email)
            formData.append('imageName', values.imageName)
            formData.append('imageFile', values.imageFile)
            formData.append('classeId', values.classeId)
            AddOrEdit(formData, resetForm)    
        }
    }





    return (
        <>      
            <Card >
                <div className="row">
                    <div className="col">
                        <CardHeader title="Students" />
                    </div>
                    <div className="col" style={{textAlign:"right"}}>
                        <Button variant="contained" color="primary" className="m-3" onClick={() => setPopupVisibility(true)} >Create</Button>
                    </div>

                </div>
                <Divider />

                <Box sx={{ minWidth: 800 }}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Avatar</TableCell>
                                <TableCell>UserName</TableCell>
                                <TableCell>email</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                StudentList.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Avatar alt="Remy Sharp" src={item.imageSrc}  />
                                        </TableCell>
                                        <TableCell>
                                            {item.userName}
                                        </TableCell>
                                        <TableCell>
                                            {item.email}
                                        </TableCell>
                                        <TableCell>
                                            <Button onClick={()=> UpdateBtnClick(item.id) }><EditIcon /></Button>
                                            <Button><DeleteIcon color="secondary"/></Button>
                                        </TableCell>

                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </Box>

            </Card>
            <Popup
                title="List of Orders"
                openPopup={PopupVisibility}
                setOpenPopup={setPopupVisibility} fullWidth="true"
            >
                <form autoComplete="off" noValidate onSubmit={handleFormSubmit}>
                    <div className="card">
                        <img src={values.imageSrc} className="card-img-top" style={{width:"300px"}} />
                        <div className="card-body">
                            <div className="form-group">
                                <input type="file" accept="image/*" className={"form-control-file" }
                                    onChange={showPreview} id="image-uploader" />
                            </div>
                            <Grid container >
                                <Grid item xs={5} className="mr-5">
                                    <TextField 
                                        label= "UserName" 
                                        name= "userName" 
                                        value={values.userName} 
                                        error={errors.userName}
                                        onChange={handleInputChange}
                                        margin="normal"
                                        fullWidth 
                                    />
                                    <TextField 
                                        label= "firstName" 
                                        name= "firstName" 
                                        value={values.firstName} 
                                        error={errors.firstName}
                                        onChange={handleInputChange}
                                        margin="normal"
                                        fullWidth
                                    />
                                    <TextField 
                                        label= "password" 
                                        name= "password" 
                                        value={values.password} 
                                        error={errors.password}
                                        onChange={handleInputChange}
                                        margin="normal"
                                        fullWidth
                                    />
                                </Grid>                            
                                <Grid item xs={5} >
                                    <TextField 
                                        label= "email" 
                                        name= "email" 
                                        value={values.email} 
                                        error={errors.email}
                                        onChange={handleInputChange}
                                        margin="normal"
                                        fullWidth
                                    />
                                    <TextField 
                                        label= "lastName" 
                                        name= "lastName" 
                                        value={values.lastName} 
                                        error={errors.lastName}
                                        onChange={handleInputChange}
                                        margin="normal"
                                        fullWidth
                                    />
                                    <div className="form-group mt-3">
                                        <select 
                                            label="Classe" 
                                            name="classeId" 
                                            onChange={handleInputChange}
                                            className="form-control"
                                            
                                        >
                                        
                                            <option value={0} label="select" />
                                            {Classes.map(item =>{ 
                                                if(item.id === values.classeId) 
                                                    return <option value={item.id} selected label={item.name} /> 
                                                else
                                                    return <option value={item.id} label={item.name} /> 
                                            
                                            })}
                                            
                                        </select>
                                        <small style={{color:'red'}}>{errors.classeId}</small>
                                    </div>
                                </Grid>
                            </Grid> 
                            <br /><br/>
                            <div className="form-group text-center">

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                endIcon={<SendIcon />}
                            >Send</Button>
                            </div>
                            <br />

                        </div>
                    </div>
                </form>
            </Popup>
        </>

    )
}
