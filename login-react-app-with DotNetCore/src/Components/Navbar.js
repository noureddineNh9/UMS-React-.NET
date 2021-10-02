import React from 'react'
import { connect } from 'react-redux'
import { Link, Redirect} from 'react-router-dom';
import axios from "axios";
import UserContext from '../Context/UserContext';
import { useContext } from 'react';

function Navbar(props) {

    //const history = useHistory()

    const logout = () => {
        axios.post("http://localhost:21260/api/Users/Logout")
        .then(res => {
            console.log(res.data)
        })
        .catch(err => console.log(err))
        //history.push("/")
        
        userContext.setisAuth(false)
        userContext.setUser({})
    }

    const userContext = useContext(UserContext)

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#"><strong> UMS</strong></a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item ">
                        <Link className="nav-link" to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/Secret">Secret</Link>
                    </li>   
                    <li className="nav-item">
                        <Link className="nav-link" to="/AdminArea">Admin Area</Link>
                    </li>     
                    <li className="nav-item">
                        <Link className="nav-link" to="/StudentArea">Student Area</Link>
                    </li>  
                    <li className="nav-item">
                        <Link className="nav-link" to="/ProfessorArea">Professor Area</Link>
                    </li>  
                

                </ul>
            </div>
            {
                userContext.isAuth ?  <> 
                    <a href="/"><button class="btn btn-outline-danger my-2 my-sm-0" onClick={logout} >Logout</button></a>
                </>
                :
                <>
                    <Link to="/login" ><button class="btn btn-success my-2 my-sm-0"  >Login</button></Link>
                </>
            } 
        </nav>

    )
}



export default Navbar;
