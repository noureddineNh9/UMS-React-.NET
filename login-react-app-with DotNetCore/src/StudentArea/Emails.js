import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import UserContext from '../Context/UserContext';
import Popup from '../layouts/Popup';
import EmailContent from './EmailContent';
import ListEmails from './ListEmail'
import SendEmailForm from './SendEmailForm'


export default function Emails() {
    const userContext = useContext(UserContext);
    const [ShowEmailInfo, setShowEmailInfo] = useState(false);
    const [PopupVisibility, setPopupVisibility] = useState(false);
    const [showProfessorsOrStudents, setShowProfessorsOrStudents] = useState(true);
    const [RicipientInfo, setRicipientInfo] = useState({});
    const [popupContent, setPopupContent] = useState("");
    const [DiscussionList, setDiscussionList] = useState([])
    const [EmailSelected, setEmailSelected] = useState({})


    const data = useSelector(state => state.EmailReducer)

    console.log(data);


    const selectRicipient = value => {
        setRicipientInfo(value);
        setPopupContent("sendEmail");
    }

    const newEmailBtn = () => {
        setPopupContent("");
        setPopupVisibility(true)
    }


    const selectedEmail = mail => {
        setEmailSelected(mail)
    }

    return (<>
        <div className="card" style={{height:'100%'}}>
            <div className="mt-4 ml-4 mb-4">
                <div style={{textAlign:'right'}}>
                    <button onClick={newEmailBtn} className="btn btn-secondary mr-4">New Email</button>
                </div>
                <hr />
                <div className="row">
                    <div className="col-8">
                        
                        { ShowEmailInfo === true && <EmailContent EmailSelected={EmailSelected} />}
                    </div>
                    <div className="col-4" >
                        <ListEmails setShowEmailInfo={setShowEmailInfo} emails={data.emails} selectedEmail={selectedEmail}/>
                    </div>
                </div>     
            </div>
        </div>
        <Popup
            title="List of Orders"
            openPopup={PopupVisibility}
            setOpenPopup={setPopupVisibility}  fullWidth="false" maxWidth="md"
        >
            {
                popupContent === "" && <>
            
            <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Professors</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Students</a>
                </li>
            </ul>
            <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                    {
                        data.professors.map(item => (
                            <button onClick={()=> selectRicipient(item)} type="button" class="list-group-item list-group-item-action">
                                <h5>{item.firstName} {item.lastName}</h5>
                            </button>
                        ))
                    }
                </div>
                <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                {
                        data.students.map(item => (
                            <button onClick={()=> selectRicipient(item)} type="button" class="list-group-item list-group-item-action">
                                <h5>{item.firstName} {item.lastName}</h5>
                            </button>
                        ))
                }
                </div>
            </div>
            </> }

            { popupContent === "sendEmail" && <SendEmailForm 
                                                setPopupVisibility={setPopupVisibility} 
                                                sender={userContext.User} 
                                                ricipient={RicipientInfo}
                                            />
            }

        </Popup>


    </>)
}
