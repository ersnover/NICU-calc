import React, {useState} from 'react'
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom'
import '../css/babyView.css'
import * as env from '../env'
import axios from 'axios';

const Overview = (props) => {
    
    const [modBaby, setModBaby] = useState({
        ...props.baby
    })

    const [flag, setFlag] = useState("")
    const [renderMore, setRenderMore] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [passwordRender, setPasswordRender] = useState(false)
    const [password, setPassword] = useState("")

    const [redirect, setRedirect] = useState({
        activated: false,
        pathname: "",
        payload: ""
    })

    const toggleRenderMore = () => {
        if (renderMore) {
            setRenderMore(false)
            setEditMode(false)
            setPasswordRender(false)
         } else {
            setRenderMore(true)
         } 
    }

    const actionButton = () => {
        editMode ? editBaby() : setPasswordRender(true)
    }

    const renderButtons = () => {
        return (
            <div className="moreButtonsDiv">
                <button className="actionButton editButton" onClick={toggleEdit}>{editMode ? "Cancel" : "Edit Baby"}</button>

                <button className="actionButton deleteButton" onClick={actionButton}>{editMode ? "Save Changes" : "Delete Baby"}</button>
            </div>
        )
    }

    const toggleEdit = () => {
        if (editMode) {
            setEditMode(false)
        } else {
            setEditMode(true)
            setPasswordRender(false)
        }
    }

    const renderPassword = () => {
        return (
            <div className="passwordDiv">
                <h3>Enter Password:</h3>

                <input type="password" name="password" placeholder="password" onChange={(e) => {setPassword(e.target.value)}} />

                <div className="pwButtonsDiv">
                    <button className="submitButton cancelButton" onClick={() => {setPasswordRender(false)}}>Cancel</button>
                    <button className="submitButton deleteButton" onClick={deleteBaby}>Delete Baby</button>
                </div>
            </div>
        )
    }

    const editBaby = () => {
        axios.patch(`${env.serverUrl}/b/baby`, {
            docId: props.docId,
            babyId: props.baby.id,
            baby: modBaby
        })
        .then(res => {
            if (res.data.baby) {
                props.setOverlordBaby(modBaby)
                setEditMode(false)
                setRedirect({
                    activated: true,
                    pathname: '/main/babyView',
                    payload: res.data.baby
                })
            } else if (res.data.error) {
                setFlag(res.data.error)
            } else {
                setFlag("Error: Baby not updated")
            }
        })
    }

    const handleChange = (e) => {
        setModBaby({
            ...modBaby,
            [e.target.name]: e.target.value
        })
    }

    const renderDataMode = (data, label, unit) => {
        if (editMode) {
            return (
                <input type="text" style={{width: 50}} name={label} value={data} onChange={handleChange} />
            )
        } else {
            return (
                data
            )
        }
    }

    const renderRoom = () => {
        if (editMode) {
            return (
                <input type="text" style={{width: 30}} name="roomNum" value={modBaby.roomNum} onChange={handleChange} />
            )
        } else {
            return (
                modBaby.roomNum
            )
        }
    }

    const renderDate = () => {
        if (editMode) {
            return (
                <input type="datetime-local" style={{width: 150}}name="birthDate" value={modBaby.dateString} onChange={handleChange} />
            )
        } else {
            return (
                <span className="dataPoint">{props.baby.dateString}</span>
            )
        }
    }

    const deleteBaby = () => {
        axios.delete(`${env.serverUrl}/b/baby`, {
            data: {
                babyId: props.baby.id,
                userId: props.docId,
                password: password
            }
        })
        .then(res => {
            if (res.data.success) {
                setRedirect({
                    activated: true,
                    pathname: "/main"
                })
            } else if (res.data.error) {
                setFlag(res.data.error)
            } else {
                setFlag("Error: Could not delete baby")
            }
        })
    }


    return (
        <div className="pageComponent">
            {redirect.activated ? <Redirect exact to={{pathname: redirect.pathname, state: redirect.payload}} /> : null}
            <h2>Baby Details</h2>
           <span className="smallHeading">Room {renderRoom()}</span>
            <div className="dataContainer">
            <div className="dataSet">
                <span className="dataLabel">Birth Weight: </span>
                <span className="dataPoint">{renderDataMode(modBaby.birthWeight, "birthWeight")} kg</span>
            </div>
            <div className="dataSet">
                <span className="dataLabel">Birth Date: </span>
                {renderDate()}
            </div>
            <div className="dataSet">
                <span className="dataLabel">Hour of Life: </span>
                <span className="dataPoint">{props.baby.lifeHour} hrs</span>
            </div>
            <div className="dataSet">
                <span className="dataLabel">Day of Life: </span>
                <span className="dataPoint">{props.baby.lifeDay} days</span>
            </div>
            <div className="dataSet">
                <span className="dataLabel">Gestational Age: </span>
                <span className="dataPoint">{renderDataMode(modBaby.gestAge, "gestAge")} days</span>
            </div>
            <div className="dataSet">
                <span className="dataLabel">CGA: </span>
                <span className="dataPoint">{props.baby.corrGestAge} days</span>
            </div>
            </div>
            <span className="flagSpan">{flag}</span>
            <button className="toggleButton" onClick={toggleRenderMore}>More...</button>
            {renderMore ? renderButtons() : null}
            {passwordRender ? renderPassword() : null}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        docId: state.docId
    }
}

export default connect(mapStateToProps)(Overview)