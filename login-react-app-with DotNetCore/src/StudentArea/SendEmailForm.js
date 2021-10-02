import { useFormik } from 'formik'
import React, { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import UserContext from '../Context/UserContext';
import { SendEmail } from "../Store/actions/actions"

export default function SendEmailForm(props) {
    const dispatch = useDispatch()

    console.log(props.sender);

    const formik = useFormik({
        initialValues: {
            object:'obj',
            message:'msg',
            senderID: props.sender.id,
            ricipientId: props.ricipient.id,
            senderName: props.sender.firstName + props.sender.lastName,
            ricipientName: props.ricipient.firstName + props.ricipient.lastName

        },
        onSubmit: values => {
            console.log(values)
            const result = SendEmail(values);
            console.log(result);
            props.setPopupVisibility(false)
            dispatch({
                type: "SEND_EMAIL",
                data: values
            })
        }
    });

    return (
        <div className="card" style={{minHeight:'600px'}}>
            <div className="card-body">
                <form onSubmit={formik.handleSubmit}>
                    <div className="form-group row">
                        <label className=" col-sm-2" >send To :</label>
                        <p>{props.ricipient.firstName} {props.ricipient.lastName}</p>
                    </div>
                    <div className="form-group row">
                        <label className="col-form-label col-sm-2" >Object :</label>
                        <input type="text" className="form-control col-sm-4" 
                            name="object" value={formik.values.object} onChange={formik.handleChange} 
                        />
                    </div>
                    <div className="form-group row">
                        <label className="col-form-label col-sm-2" >Message :</label>
                        <textarea  rows="10" className="form-control col-sm-8"  
                            name="message" value={formik.values.message} onChange={formik.handleChange} 
                        />
                    </div>
                    <div className="form-group" style={{textAlign:'right'}}>
                        <button type="submit" className="btn btn-primary pull-right" >Send</button>
                    </div>

                </form>
                
            </div>
        </div>    
    )
}
