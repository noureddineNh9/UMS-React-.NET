import React from 'react'
import { Outlet } from 'react-router'
import DashboardNavbar from '../Components/DashboardNavbar'

export default function index() {
    return (

        <div>
            <DashboardNavbar />
                Admin Areascwxc
            <Outlet /> 
        </div>
    )
}
