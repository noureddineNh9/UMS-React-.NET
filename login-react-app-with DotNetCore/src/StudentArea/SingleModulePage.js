import React from 'react'
import { useParams } from "react-router-dom";

export default function SingleModulePage(props) {
    const { id } = useParams();

    
    return (
        <div>
            <h3>{id}</h3>
        </div>
    )
}
