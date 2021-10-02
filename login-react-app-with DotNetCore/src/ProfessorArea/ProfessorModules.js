import { Button, Grid, TextField } from '@material-ui/core';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { createApiEndpoint, ENDPOINTS } from '../Api';
import UserContext from '../Context/UserContext'
import Popup from '../layouts/Popup';




const initialValues = {
    sectionNum: 1,
    File: null,
    moduleId: 0
}

const Sections = [1,2,3,4,5,6,7,8]

export default function ProfessorModules() {
    
    const userContext = useContext(UserContext)
    const info = userContext.User;
    
    const [NubmerOfSection, setNubmerOfSection] = useState(10)
    const [Modules, setModules] = useState([])
    const [ModuleId, setModuleId] = useState(0)
    const [PopupVisibility, setPopupVisibility] = useState(false);
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({})

    useEffect(()=>{
        createApiEndpoint(ENDPOINTS.MODULES).fetchAll()
        .then(res => {
            //setModules(res.data)
        })
        .catch(err => console.log(err))
    }, [])

    useEffect(()=>{
        if(info.id !== 0)
            setModuleId(info.ProfModules)
        console.log(info.ProfModules);
    }, [info])

    console.log(Modules);

    const AddOrEdit = (formData, onSuccess) => {
        createApiEndpoint("Files/uploadFiles").create(formData)
        .then(res => {
            console.log(res.data);
            onSuccess()
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
            let File = e.target.files[0];
            const reader = new FileReader();
            reader.onload = x => {
                setValues({
                    ...values,
                    File
                })
            }
            reader.readAsDataURL(File)
        }
        else {
            setValues({
                ...values,
                File: null
            })
        }
    }


    const validateForm = () => {
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
        document.getElementById('file-uploader').value = null;
        setErrors({})
        setPopupVisibility(false)
    }

    const handleFormSubmit = e => {
        console.log(values);
        e.preventDefault()
        if (validateForm()) {
            
            const formData = new FormData()
            formData.append('sectionNum', values.sectionNum)
            formData.append('File', values.File)
            formData.append('moduleId', values.moduleId)
            AddOrEdit(formData, resetForm)    
        }
    }



        
    return (
        <div>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">

                <ul class="nav nav-tabs mr-auto" id="myTab" role="tablist">
                    {
                        info.id !== 0 && info.ProfModules.map(item => (
                        <li class="nav-item">
                            <a class="nav-link" id={item.id + "-tab"} data-toggle="tab" href={"#aze" + item.id} role="tab" aria-controls={item.name} aria-selected="false">{item.name}</a>
                        </li>
                        ))
                    }
                </ul>
                <button onClick={()=>setPopupVisibility(true)} class="btn btn-outline-secondary my-2 my-sm-0" type="submit">Add File</button>
            </nav>
            <div class="tab-content" id="myTabContent">
                {
                    info.id !== 0 && info.ProfModules.map(item => (
                    <div class="tab-pane fade" id={"aze" + item.id} role="tabpanel" aria-labelledby={item.id + "-tab"}>
                        {
                            Sections.map(s => <>
                                <h5>Section {s}</h5>
                                {
                                    item.files.map(element => {
                                        if(s === element.sectionNum) return (<>
                                            <a href={"http://localhost:21260/api/Files/DownLoadFile?id=" + element.id}>{element.name}</a><br/>
                                        </>)
                                        else return <></>
                                    })
                                }
                                <hr/>
                            </>)
                        }

                    </div>
                    ))
                }
            </div>

            <div>
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
                                <input type="file" className={"form-control-file" }
                                    onChange={showPreview} id="file-uploader" />
                            </div>
                            <Grid container >
                                <Grid item xs={5} className="mr-5">
                                    <TextField 
                                        label= "sectionNum" 
                                        name= "sectionNum" 
                                        value={values.sectionNum} 
                                        error={errors.sectionNum}
                                        onChange={handleInputChange}
                                        margin="normal"
                                        fullWidth 
                                    />
                                </Grid>                            
                                <Grid item xs={5} >
                                <select 
                                    label="moduleId" 
                                    name="moduleId" 
                                    onChange={handleInputChange}
                                    className="form-control mt-3"
                                    error={errors.moduleId}
                                >
                                
                                    <option value={"0"} label="select" />
                                    { info.id !== 0 && info.ProfModules.map(item =>{ 
                                        if(item.id === values.moduleId) 
                                            return <option value={item.id} selected label={item.name} /> 
                                        else
                                            return <option value={item.id} label={item.name} /> 
                                    
                                    })}
                                
                                </select>

                                </Grid>
                            </Grid> 
                            <br /><br/>
                            <div className="form-group text-center">

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                            >Send</Button>
                            </div>
                            <br />

                        </div>
                    </div>
                </form>
            </Popup>
            </div>


        </div>
    )
}
