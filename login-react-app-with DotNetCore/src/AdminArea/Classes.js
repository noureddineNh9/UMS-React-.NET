import React, { useState, useEffect } from 'react'
import { createApiEndpoint, ENDPOINTS } from "../Api";
import DeleteOutlineTwoToneIcon from '@material-ui/icons/DeleteOutlineTwoTone';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Popup from '../layouts/Popup';
import Notification from '../layouts/Notification';
import LoadingPage from '../Pages/LoadingPage'

const InitialValues =  { id: 0, name: ''}


export default function Classes() {

    const [classeId, setclasseId] = useState(0);
    const [orderListVisibility, setOrderListVisibility] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notify, setNotify] = useState({ isOpen: false })
    const [Classes, setClasses] = useState([])
    const [values, setValues] = useState(InitialValues);
    const [errors, setErrors] = useState({});

    useEffect(()=>{
        createApiEndpoint(ENDPOINTS.CLASSES).fetchAll()
        .then(res => {
            console.log(res.data);
            setClasses(res.data)
            setTimeout(function() {
                setLoading(false)
             }, 800);
            
        })
        .catch(err => console.log(err))
    },[])


    useEffect(()=>{
        if(classeId != 0)
        {
            createApiEndpoint(ENDPOINTS.CLASSES).fetchById(classeId)
            .then(res => {
                console.log(res.data);
                setValues(res.data)
            })
            .catch(err => console.log(err))
        }

    },[classeId])

    const validateForm = () => {
        let temp = {};
        temp.name = values.name != "" ? "" : "This field is required.";
        setErrors({ ...temp });
        return Object.values(temp).every(x => x === "");
    }

    const getFreshModelObject = () => (
        {
            "Id": 0,
            "Name": ''
        }
    )

    const handleUpdate = id => {
        setOrderListVisibility(true)
        setclasseId(id)
    }

    const handleCreate = id => {
        setOrderListVisibility(true)
        setclasseId(0)
        setValues(InitialValues)
    }

    const handleDelete = id => {
        if(window.confirm("Are you sure"))
        {
            createApiEndpoint(ENDPOINTS.CLASSES).delete(id)
            .then(res => {
                let newList = Classes.filter(x => x.id !== id) ;
                setClasses(newList)
                setNotify({isOpen:true, message:'Classe deleted.'});
            })
            .catch(err => console.log(err));

        }
    }
    

    const handleSubmit = e => {
        e.preventDefault();
        if (validateForm()) {
            if (values.id == 0) {
                createApiEndpoint(ENDPOINTS.CLASSES).create(values)
                    .then(res => {
                        console.log(res);
                        resetFormControls();
                        setNotify({isOpen:true, message:'New Classe is created.'});
                        let newList = Classes.concat([res.data]) ;
                        setClasses(newList)
                        setOrderListVisibility(false)
                    })
                    .catch(err => console.log(err));
            }
            else {
                createApiEndpoint(ENDPOINTS.CLASSES).update(values.id, values)
                    .then(res => {
                        setclasseId(0);
                        setOrderListVisibility(false)
                        let newList = Classes.map( item => {
                            if(item.id === values.id)
                                return values
                            else return item
                        })
                        console.log(newList);
                        setClasses(newList)

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

    if(loading) return <LoadingPage />
    else return (
        <>       
            <Card >
                <div className="row">
                    <div className="col">
                        <CardHeader title="Classes" />  
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
                                Classes.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            {item.id}
                                        </TableCell>
                                        <TableCell>
                                            {item.name}
                                        </TableCell>
                                        <TableCell>
                                            <Button  onClick={ ()=> handleUpdate(item.id)} ><EditIcon/></Button>
                                            <Button onClick={() => handleDelete(item.id)}><DeleteIcon color="secondary"/></Button>
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
                openPopup={orderListVisibility}
                setOpenPopup={setOrderListVisibility}>
                    <form name="form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Classe Name</label>
                            <input type="text" className="form-control" name="name"             
                                onChange={handleInputChange}
                                value={values.name} />
                        </div>
                        <div className="form-group">
                            <input type="submit" className="btn btn-primary" />
                        </div>
                    </form>
            </Popup>
            <Notification
                {...{ notify, setNotify }} />                

        </>
    )
}

