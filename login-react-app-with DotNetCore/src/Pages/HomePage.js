import React from 'react'
import { useContext } from 'react'
import { Outlet } from 'react-router';
import UserContext from '../Context/UserContext'

export default function HomePage() {

    const userContext = useContext(UserContext);
    console.log(userContext);

    return (
        <div>
            <h3>Home page</h3>
            <br/><br/>
            {
                userContext.isAuth ? <h3> {userContext.User.email} </h3>
                :<h3>no</h3>
            }
            <Outlet />

        </div>
    )
}
