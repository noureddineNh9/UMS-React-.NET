import React, { useContext } from 'react'
import { useSelector } from 'react-redux';
import UserContext from '../Context/UserContext'

export default function EmailContent(props) {

    const userContext = useContext(UserContext);
    const emails = useSelector(state => state.EmailReducer.emails)



    return (
        <div className="card" style={{minHeight:'600px'}}>
            <div className="card-body">
                {
                    userContext.User.id === props.EmailSelected.senderID ? <>
                        <h5>To :  {props.EmailSelected.ricipientName}</h5>
                    </> : <>
                        <h5>From :  {props.EmailSelected.senderName}</h5>
                    </>
                }
                <p>Object  :  {props.EmailSelected.object}</p>
                <p>Message  :  {props.EmailSelected.message}</p>
                    
            </div>
        </div>  
    )
}
