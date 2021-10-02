import React, { useState, useEffect } from 'react'
import { createApiEndpoint, ENDPOINTS } from "../Api";
import DeleteOutlineTwoToneIcon from '@material-ui/icons/DeleteOutlineTwoTone';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Popup from '../layouts/Popup';
import Professors from './Professors';

const InitialValues =  { id: 0, userName: '',firstName:'', lastName:'', email:'default@mail.com', password:'Eddine_20' }



export default function ProfessorForm(props) {

    const [professorId, setProfessorId] = useState(0);
    const [PopupVisibility, setPopupVisibility] = useState(false);
    const [notify, setNotify] = useState({ isOpen: false })
    const [professors, setprofessors] = useState(props.professors)
    const [values, setValues] = useState(InitialValues);
    const [errors, setErrors] = useState({});


    useEffect(()=>{
        if(professorId !== 0)
        {
            createApiEndpoint("Professors").fetchById(professorId)
            .then(res => {
                console.log(res.data);
                setValues(res.data)
            })
            .catch(err => console.log(err))
        }

    },[professorId])

    const validateForm = () => {
        let temp = {};
        temp.name = values.name != "" ? "" : "This field is required.";
        setErrors({ ...temp });
        return Object.values(temp).every(x => x === "");
    }

    const handleUpdate = id => {
        setPopupVisibility(true)
        setProfessorId(id)
    }

    const handleCreate = id => {
        setPopupVisibility(true)
        setProfessorId(0)
        setValues(InitialValues)
    }

    const handleDelete = id => {
        if(window.confirm("Are you sure"))
        {
            createApiEndpoint("Professors").delete(id)
            .then(res => {
                let newList = professors.filter(x => x.id !== id) ;
                setprofessors(newList)
            })
            .catch(err => console.log(err));

        }
    }

    const handleSubmit = e => {
        e.preventDefault();
        if (validateForm()) {
            if (values.id == 0) {
                console.log(values);
                createApiEndpoint("Professors/Register").create(values)
                    .then(res => {
                        console.log(res);
                        resetFormControls();
                        let newList = professors.concat([{ 
                            id:values.id ,
                            userName: values.userName,
                            firstName:values.firstName,
                            lastName:values.lastName,
                            email:values.email
                        }]);
                        setprofessors(newList)
                        setPopupVisibility(false)
                    })
                    .catch(err => console.log(err));
            }
            else {
                createApiEndpoint("Professors").update(values.id, values)
                    .then(res => {
                        setProfessorId(0);
                        setPopupVisibility(false)
                        let newList = professors.map( item => {
                            if(item.id === values.id)
                                return values
                            else return item
                        })
                        console.log(newList);
                        setprofessors(newList)

                    })
                    .catch(err => console.log(err));
            }
        }

    }
    

    const handleInputChange = e => {
        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })
    }

    const resetFormControls = () => {
        setValues(InitialValues);
        setErrors({})
    }






    return (
        <>      
            <Card >
                <div className="row">
                    <div className="col">
                        <CardHeader title="professors" />  
                    </div>
                    <div className="col" style={{textAlign:"right"}}>
                        <Button variant="contained" color="primary" className="m-3" onClick={handleCreate} >Create</Button>
                    </div>

                </div>
                <Divider />

                <Box sx={{ minWidth: 800 }}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                professors.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            {item.firstName}
                                        </TableCell>
                                        <TableCell>
                                            {item.lastName}
                                        </TableCell>
                                        <TableCell>
                                            {item.userName}
                                        </TableCell>
                                        <TableCell>
                                            {item.email}
                                        </TableCell>
                                        <TableCell>
                                            <Button><EditIcon onClick={ ()=> handleUpdate(item.id)   }/></Button>
                                            <Button onClick={ ()=> handleDelete(item.id) }><DeleteIcon color="secondary"/></Button>
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
                setOpenPopup={setPopupVisibility}  fullWidth="true"
            >
                <form name="form" onSubmit={handleSubmit}>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-6'>
                                <TextField 
                                    label= "firstName" 
                                    name= "firstName" 
                                    value={values.firstName} 
                                    error={errors.firstName}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    fullWidth 
                                />
                            </div>
                            <div className='col-6'>
                                <TextField 
                                    label= "lastName" 
                                    name= "lastName" 
                                    value={values.lastName} 
                                    error={errors.lastName}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    fullWidth 
                                />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-6'>
                                <TextField 
                                    label= "userName" 
                                    name= "userName" 
                                    value={values.userName} 
                                    error={errors.userName}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    fullWidth 
                                />
                            </div>
                            <div className='col-6'>
                                <TextField 
                                    label= "email" 
                                    name= "email" 
                                    value={values.email} 
                                    error={errors.email}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    fullWidth 
                                />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-6'>
                                <TextField 
                                    label= "password" 
                                    name= "password" 
                                    value={values.password} 
                                    error={errors.password}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    fullWidth 
                                />
                            </div>
                            <div className='col-6'>
                                <Button type="submit" >submit</Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Popup>
        </>

    )
}
