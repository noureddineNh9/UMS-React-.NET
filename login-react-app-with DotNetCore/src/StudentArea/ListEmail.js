import { Box, Button, List, ListItem } from '@material-ui/core'
import React, { useContext } from 'react'
import UserContext from '../Context/UserContext';

export default function ListEmails(props) {
    const userContext = useContext(UserContext)

    const emails = props.emails.sort((a, b) => (a.date < b.date) ? 1 : -1)

    const selectItem = (mail) => {
        props.selectedEmail(mail)
        props.setShowEmailInfo(true)
    }
    

    return (
        <>
            <div class="list-group list-group-flush" >
                {<>
                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="MailBox-tab" data-toggle="tab" href="#MailBox" role="tab" aria-controls="MailBox" aria-selected="true">MailBox</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="MessageSend-tab" data-toggle="tab" href="#MessageSend" role="tab" aria-controls="MessageSend" aria-selected="false">Message Send</a>
                        </li>
                    </ul>
                    <div class="tab-content" id="myTabContent">
                        <div class="tab-pane fade show active" id="MailBox" role="tabpanel" aria-labelledby="MailBox-tab">
                            {
                                emails.map(item => (
                                    item.ricipientId === userContext.User.id &&
                                    <button onClick={() => selectItem(item)} type="button" class="list-group-item list-group-item-action">
                                        <h5>From  :  {item.senderName}</h5>
                                        { !item.vu && <><span class="badge badge-primary badge-pill">new</span><br/></> }
                                        {
                                            item.message.length > 40 ? <span>{item.message.slice(0,40) } . . . . </span> :
                                            <span>{item.message}</span>
                                        }
                                        <br/><small className="text-muted">{item.date}</small>
                                    </button>
                    
                                ))
                            }
                        </div>
                        <div class="tab-pane fade" id="MessageSend" role="tabpanel" aria-labelledby="MessageSend-tab">
                            {
                                emails.map(item => ( item.senderID === userContext.User.id &&
                                    <button onClick={() => selectItem(item)} type="button" class="list-group-item list-group-item-action">
                                        <h5>To  : {item.ricipientName}</h5>
                                        {
                                            item.message.length > 40 ? <span>{item.message.slice(0,40) } . . . . </span> :
                                            <span>{item.message}</span>
                                        }
                                        <br/><small className="text-muted">{item.date}</small>
                                    </button>
                    
                                ))
                            }
                        </div>
                    </div>
                </>}
            </div>
        </>
    )
}
