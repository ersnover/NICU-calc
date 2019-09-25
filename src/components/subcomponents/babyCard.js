import React, {useState, useEffect} from 'react'
import {Redirect} from 'react-router-dom'
import "../../css/babyCard.css"

const BabyCard = (props) => {

    const [baby, setBaby] = useState({
        ...props.baby,
        corrGestAge: 0,
        lifeHour: 500,
        lifeDay: 500
    })

    const [redirect, setRedirect] = useState({
        activated: false,
        pathname: "",
        payload: ""
    })

    const processDate = () => {
        let [year, month, dayTime] = props.baby.birthDate.split('-')

        let [day, time] = dayTime.split('T')

        let hour = time.split(':')[0]

        let birthDate = new Date(year, month-1, day, hour)

        let today = new Date()

        let lifeHour = Math.round((today - birthDate)/3600000)
        let lifeDay = Math.trunc(lifeHour/24) + 1

        let corrGestAge = props.baby.gestAge + lifeDay

        setBaby({
            ...baby,
            corrGestAge: corrGestAge,
            lifeHour: lifeHour,
            lifeDay: lifeDay
        })

    }

    const navToBaby = () => {
        setRedirect({activated: true, pathname: '/main/babyView', payload: baby})
    }

    useEffect(() => {
        processDate()
    }, [])


    return (
        <button className="babyCardWrapperButton" onClick={navToBaby}>
            {redirect.activated ? <Redirect to={{pathname: redirect.pathname, state: redirect.payload}} /> : null}
            <div className="babyCard">
                <div className="roomDiv">
                    <span className="roomNum">{props.baby.roomNum}</span>
                    <span className="roomSpan">Room</span>
                </div>
                <div className="infoSpansDiv">
                    <span className="babyInfoSpan"><b>Day of Life:</b> {baby.lifeDay}</span>
                    <span className="babyInfoSpan"><b>Birth Weight:</b> {props.baby.birthWeight} kg</span>
                    <span className="babyInfoSpan"><b>Gestational Age:</b>  {props.baby.gestAge} days</span>
                    <span className="babyInfoSpan"><b>CGA:</b> {baby.corrGestAge} days</span>
                </div>
            </div>
        </button>
    )
}

export default BabyCard