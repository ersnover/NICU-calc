import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom'
import '../css/babyView.css'
import * as env from '../env'
import axios from 'axios';

const BabyView = (props) => {
    
    const [baby, setBaby] = useState({
        ...props.location.state,
        dateString: ""
    })

    const [modBaby, setModBaby] = useState({
        ...props.location.state
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

    const processDate = () => {
        let [year, month, dayTime] = baby.birthDate.split('-')

        let [day, time] = dayTime.split('T')

        let hour = time.split(':')[0]

        let birthDate = new Date(year, month-1, day, hour)

        let dateString = `${month}/${day}/${year}, ${hour}:00`

        let today = new Date()


        let lifeHour = Math.round((today - birthDate)/3600000)
        let lifeDay = Math.trunc(lifeHour/24) + 1

        let corrGestAge = baby.gestAge + lifeDay

        setBaby({
            ...baby,
            corrGestAge: corrGestAge,
            lifeHour: lifeHour,
            lifeDay: lifeDay,
            dateString: dateString
        })
    }

    const toggleRenderMore = () => {
        if (renderMore) {
            setRenderMore(false)
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
        editMode ? setEditMode(false) : setEditMode(true)
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
            babyId: baby.id,
            baby: modBaby
        })
        .then(res => {
            if (res.data.baby) {
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
                <span className="dataPoint">{data} {unit}</span>
            )
        }
    }

    const renderDate = () => {
        if (editMode) {
            return (
                <input type="datetime-local" name="birthDate" value={modBaby.dateString} onChange={handleChange} />
            )
        } else {
            return (
                <span className="dataPoint">{baby.dateString}</span>
            )
        }
    }

    const deleteBaby = () => {
        axios.delete(`${env.serverUrl}/b/baby`, {
            data: {
                babyId: baby.id,
                userId: props.docId,
                password: password
            }
        })
        .then(res => {
            if (res.data.success) {
                setFlag('Baby deleted successfully')
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

    useEffect(() => {
        processDate()
    }, [])

    return (
        <div className="pageComponent">
            {redirect.activated ? <Redirect exact to={{pathname: redirect.pathname, state: redirect.payload}} /> : null}
            <h2>Baby Details</h2>
            <h3>Room {baby.roomNum}</h3>
            <div className="dataContainer">
            <div className="dataSet">
                <span className="dataLabel">Birth Weight: </span>
                {renderDataMode(modBaby.birthWeight, "birthWeight", "kg")}
            </div>
            <div className="dataSet">
                <span className="dataLabel">Birth Date: </span>
                {renderDate()}
            </div>
            <div className="dataSet">
                <span className="dataLabel">Hour of Life: </span>
                {<span className="dataPoint">{baby.lifeHour} hrs</span>}
            </div>
            <div className="dataSet">
                <span className="dataLabel">Day of Life: </span>
                <span className="dataPoint">{baby.lifeDay} days</span>
            </div>
            <div className="dataSet">
                <span className="dataLabel">Gestational Age: </span>
                {renderDataMode(modBaby.gestAge, "gestAge", "days")}
            </div>
            <div className="dataSet">
                <span className="dataLabel">CGA: </span>
                <span className="dataPoint">{baby.corrGestAge} days</span>
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

export default connect(mapStateToProps)(BabyView)