import React, {useState} from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import '../css/addBaby.css'
import axios from 'axios'
import * as env from '../env'

const AddBaby = (props) => {

    const [newBaby, setNewBaby] = useState({
        docId: props.docId,
        roomNum: "",
        birthDate: "2019-09-24T13:00",
        birthWeight: "",
        gestAge: ""
    })

    const [gestAge, setGestAge] = useState({
        weeks: 0,
        days: 0
    })

    const [redirect, setRedirect] = useState({
        activated: false,
        pathname: "",
        payload: ""
    })

    const [error, setError] = useState("")

    const handleChange = (e) => {
        setNewBaby({
            ...newBaby,
            [e.target.name]: e.target.value
        })
    }

    const handleGestAgeChange = (e) => {
        setGestAge({
            ...gestAge,
            [e.target.name]: e.target.value
        })
    }


    const handleSubmit = () => {
        let postBaby = newBaby

        postBaby.roomNum = parseInt(postBaby.roomNum)
        postBaby.birthWeight = parseFloat(postBaby.birthWeight)
        postBaby.gestAge = parseInt(gestAge.weeks) * 7 + parseInt(gestAge.days)

        axios.post(`${env.serverUrl}/b/baby`, postBaby)
        .then(res => {
            if (res.data.baby) {
                // post new weight obj
                setRedirect({
                    activated: true,
                    pathname: '/main/babyView',
                    payload: res.data.baby
                })
            } else if (res.data.error) {
                setError(res.data.error)
            } else {
                setError('Error adding baby')
            }
        })
    }

    return (
        <div className="pageComponent addBabyDiv">
            {redirect.activated ? <Redirect to={{pathname: redirect.pathname, state: redirect.payload}} /> : null}
            <h3>New Baby Info</h3>
            <div className="inputDiv">
                <label htmlFor="roomNum">Room Number</label>
                <input type="text" name="roomNum" onChange={handleChange} />
            </div>
            <div className="inputDiv">
                <label htmlFor="birthDate">Birth Date</label>
                <input type="datetime-local" name="birthDate" value={newBaby.birthDate} onChange={handleChange} />
            </div>
            <div className="inputDiv">
                <label htmlFor="birthWeight">Birth Weight (kg)</label>
                <input type="text" name="birthWeight" onChange={handleChange} />
            </div>
            <div className="inputDiv">
                <label htmlFor="gestAge">Gestational Age (weeks, days)</label>
                <div className="gestAge">
                    <input type="text" name="weeks" placeholder="weeks" onChange={handleGestAgeChange} />
                    <input type="text" name="days" placeholder="days" onChange={handleGestAgeChange} />
                </div>
            </div>

            <button className="submitButton" onClick={handleSubmit}>Submit</button>
            <span className="errorSpan">{error}</span>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        docId: state.docId
    }
}

export default connect(mapStateToProps)(AddBaby)