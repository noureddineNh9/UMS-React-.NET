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
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Popup from '../layouts/Popup';

const InitialValues =  {
    id: 0,
    name: '',
    classeId: 0,
    classe: null,
    professorId: 0
}


export default function Modules() {

    const [ModuleId, setModuleId] = useState(0);
    const [orderListVisibility, setOrderListVisibility] = useState(false);
    const [notify, setNotify] = useState({ isOpen: false })
    const [Modules, setModules] = useState([])
    const [Classes, setClasses] = useState([])
    const [Professors, setProfessors] = useState([])
    const [values, setValues] = useState(InitialValues);
    const [errors, setErrors] = useState({});


    useEffect(()=>{
        createApiEndpoint(ENDPOINTS.MODULES).fetchAll()
        .then(res => {
            console.log(res.data)
            setModules(res.data)
        })
        .catch(err => console.log(err))
    },[])

    useEffect(()=>{
        createApiEndpoint(ENDPOINTS.CLASSES).fetchAll()
        .then(res => {
            setClasses(res.data)
            console.log(res.data)
        })
        .catch(err => console.log(err))

        createApiEndpoint("Professors/getAll").fetchAll()
        .then(res => {
            setProfessors(res.data)
        })
        .catch(err => console.log(err))

    },[])

    useEffect(()=>{
        console.log(values);
    },[values])

    useEffect(()=>{
        console.log(Modules);
    },[Modules])


    useEffect(()=>{
        if(ModuleId !== 0)
        {
            createApiEndpoint(ENDPOINTS.MODULES).fetchById(ModuleId)
            .then(res => {
                console.log(res.data);
                setValues(res.data)
            })
            .catch(err => console.log(err))
        }

    },[ModuleId])

    const validateForm = () => {
        let temp = {};
        temp.name = values.name != "" ? "" : "This field is required.";
        setErrors({ ...temp });
        return Object.values(temp).every(x => x === "");
    }

    const handleUpdate = id => {
        setOrderListVisibility(true)
        setModuleId(id)
    }

    const handleCreate = id => {
        setOrderListVisibility(true)
        setModuleId(0)
        setValues(InitialValues)
    }

    const handleDelete = id => {
        if(window.confirm("Are you sure"))
        {
            createApiEndpoint(ENDPOINTS.MODULES).delete(id)
            .then(res => {
                let newList = Modules.filter(x => x.id !== id) ;
                setModules(newList)
            })
            .catch(err => console.log(err));

        }
    }


    const handleSubmit = e => {
        e.preventDefault();
        if (validateForm()) {
            if (ModuleId === 0 ){
                createApiEndpoint(ENDPOINTS.MODULES).create(values)
                .then(res => {
                    console.log(res.data);
                    resetFormControls();
                    let newList = Modules.concat([res.data]) ;
                    setModules(newList)
                    console.log(newList);
                    setOrderListVisibility(false)
                })
                .catch(err => console.log(err));

            }
            else {
                createApiEndpoint(ENDPOINTS.MODULES).update(values.id, values)
                    .then(res => {
                        setModuleId(0);
                        setOrderListVisibility(false)
                        let newList = Modules.map( item => {
                            if(item.id === values.id)
                                return res.data
                            else return item
                        })
                        setModules(newList);

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

    const getProfName = id => {
        let result = Professors.find(item => item.id === id)
        return result.firstName + " " + result.lastName
    }
        
    return (
        <>      
            <Card >
                <div className="row">
                    <div className="col">
                        <CardHeader title="Modules" />  
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
                                <TableCell>Classe</TableCell>
                                <TableCell>Professor</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {   
                                Modules.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            {item.id}
                                        </TableCell>
                                        <TableCell>
                                            {item.name}
                                        </TableCell>
                                        <TableCell>
                                            {item.classe.name}
                                        </TableCell>
                                        <TableCell>
                                            {getProfName(item.professorId)}
                                        </TableCell>
                                        <TableCell>
                                            <Button onClick={ ()=> handleUpdate(item.id)} ><EditIcon /></Button>
                                            <Button onClick={()=>handleDelete(item.id)} ><DeleteIcon  color="secondary"/></Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }   
                        </TableBody>
                    </Table>
                </Box>

            </Card>
            {
                Classes.length !== 0 ? <> 
                
            <Popup
                title="List of Orders"
                openPopup={orderListVisibility}
                setOpenPopup={setOrderListVisibility}
                fullWidth={true}
            >
                <div className="container p-2 ">
                    <form name="form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input 
                                type="text" 
                                placeholder="Name"
                                className="form-control"
                                name="name"             
                                onChange={handleInputChange}
                                value={values.name} 
                                error={errors.name}
                            />
                        </div>
                        <div className="form-group">
                            <select 
                                label="Classe" 
                                name="classeId" 
                                onChange={handleInputChange}
                                className="form-control"
                                options={Classes} 
                                error={errors.classeId}
                            >
                            
                                <option value={"0"} label="select" />
                                {Classes.map(item =>{ 
                                    if(item.id === values.classeId) 
                                        return <option value={item.id} selected label={item.name} /> 
                                    else
                                        return <option value={item.id} label={item.name} /> 
                                
                                })}
                                
                            </select>
                        </div>
                        <div className="form-group">
                            <select 
                                label="professorId" 
                                name="professorId" 
                                onChange={handleInputChange}
                                className="form-control"
                                
                                error={errors.professorId}
                            >
                            
                                <option value={"0"} label="select" />
                                {Professors.map(item =>{ 
                                    if(item.id === values.professorId) 
                                        return <option value={item.id} selected label={item.userName} /> 
                                    else
                                        return <option value={item.id} label={item.userName} /> 
                                
                                })}
                                
                            </select>
                        </div>
                        <div className="form-group">
                            <input type="submit" className="btn btn-primary" />
                        </div>
                    </form>
                </div>
            </Popup>

                
                </> : <p>vide</p>
            }


        </>
    )
}

