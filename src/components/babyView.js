import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import Overview from './overview'
import Weights from './weights'
import Sugars from './sugars'
import Fluids from './fluids'
import BiliTool from './bilitool'
import BloodGas from './bloodgas'
import {ModuleNavbar} from './subcomponents/moduleNavbar'

const BabyView = (props) => {

    const [baby, setBaby] = useState({
        ...props.location.state,
        dateString: ""
    })

    const setOverlordBaby = (childBaby) => {
        setBaby({
            ...childBaby
        })
    }

    const [componentToRender, setComponentToRender] = useState('overview')

    const renderSwitch = () => {
        switch(componentToRender) {
            case "weights":
                return <Weights baby={baby} setOverlordBaby={setOverlordBaby} />
            case "sugars":
                return <Sugars baby={baby} setOverlordBaby={setOverlordBaby} />
            case "fluids":
                return <Fluids baby={baby} setOverlordBaby={setOverlordBaby} />
            case "bilitool":
                return <BiliTool baby={baby} setOverlordBaby={setOverlordBaby} />
            case "bloodgas":
                return <BloodGas baby={baby} setOverlordBaby={setOverlordBaby} />
            default:
                return <Overview baby={baby} setOverlordBaby={setOverlordBaby} />
        }
    }

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

    useEffect(() => {
        processDate()
    }, [])

    return (
        <div className="pageComponent">
            <ModuleNavbar activeComponent={componentToRender} setComponentToRender={setComponentToRender} />
            {renderSwitch()}
        </div>
    )
}

export default connect()(BabyView)