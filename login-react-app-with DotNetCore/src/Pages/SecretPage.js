import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { connect } from 'react-redux';
import api from "../Api";
import UserContext from '../Context/UserContext';
import { getData } from "../Store/actions/actions";


 function SecretPage(props) {

    const userContext = useContext(UserContext)
    const [data, setData] = useState([])

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(()=>{
        if(userContext.isAuth)
        {
            props.getdata(userContext.User.jwtToken);
        }
    },[userContext.User])

    useEffect(()=>{
        console.log(props.userInfo.Data);
        setData(props.userInfo.Data)
    },[props.userInfo.Data])

    let items;
    if(data !== {})
    {
        items = data.map( item => <tr>
            <td>{item.date}</td>
            <td>{item.summary}</td>
            <td>{item.temperatureC}</td>
        </tr>) 
    }



    return (
        <div>
            <table className="table">
                <tr>
                    <th>date</th>
                    <th>summary</th>
                    <th>temperatureC</th>
                </tr>
                {items}
            </table>
        </div>
    )
}

const mapStateToProps = (state) => {
    return{
        userInfo: state.UserReducer,
    }
}

const mapDispatchToProps = {
    getdata : getData
}

export default connect(mapStateToProps, mapDispatchToProps)(SecretPage);