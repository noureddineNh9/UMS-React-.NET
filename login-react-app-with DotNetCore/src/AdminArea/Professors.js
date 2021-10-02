import React, { useState, useEffect } from 'react'
import { createApiEndpoint } from "../Api";
import ProfessorForm from './ProfessorForm';



export default function Professors() {

    const [professors, setprofessors] = useState([])
    const [Show, setShow] = useState(false)

    useEffect(()=>{
        createApiEndpoint("Professors/getAll").fetchAll()
        .then(res => {
            console.log(res.data);
            setprofessors(res.data)
            setShow(true)
        })
        .catch(err => console.log(err))
    },[])

        
    return (<>
       { Show === true && <ProfessorForm professors={professors} /> } 
    </>)
}

