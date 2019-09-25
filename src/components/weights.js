import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import axios from 'axios';
import * as env from '../env'

const Weights = (props) => {

    const [weights, setWeights] = useState([])
    const [newWeight, setNewWeight] = useState(false)
    const [flag, setFlag] = useState("")

    const fetchWeights = () => {
        axios.post(`${env.serverUrl}/b/weight/all`, {babyId: props.baby.id})
        .then(res => {
            if (res.data.weights) {
                setWeights(sortWeights(res.data.weights))
            } else if (res.data.message) {
                setFlag(res.data.message)
            } else {
                setFlag("Error: Unable to retrieve weights")
            }
        })
    }

    const processDate = (dateString) => {
            let [year, month, dayTime] = dateString.split('-')
            let day = dayTime.split('T')[0]

            dateString = `${month}/${day}/${year}`
            let lifeDay = calcLifeDay(dateString)

            return [dateString, lifeDay]
    }

    const calcLifeDay = (date) => {
        let weightDate = new Date(date)
        let birthDate = new Date(props.baby.birthDate)

        let lifeDay = Math.trunc((weightDate - birthDate)/86400000) + 1

        return lifeDay
    }

    const sortWeights = (weightsArray) => {

        weightsArray.sort(function(a, b) {
        let aDate = new Date(a.date)
        let bDate = new Date(b.date)
        return aDate - bDate
        })

        return weightsArray
    
    }

    const renderTable = () => {
        return (
            <div className="tableDiv">
                <table>
                    <tbody>
                    <tr>
                        <th>Day of Life</th>
                        <th>Weight</th>
                        <th>Daily Change</th>
                        <th>Total Change</th>
                        <th>7 Day Avg</th>
                        <th>Date</th>
                    </tr>
                    <tr>
                        <td>day</td>
                        <td>g</td>
                        <td>g</td>
                        <td>g</td>
                        <td>g/day</td>
                        <td></td>
                    </tr>
                    {weights.map((weight) => {
                        let [dateString, lifeDay] = processDate (weight.date)

                        return (
                            <tr key={weight.id}>
                                <td>{lifeDay}</td>
                                <td>{weight.weight}</td>
                                <td>{weight.deltaDay}</td>
                                <td>{weight.deltaBirthWeight}</td>
                                <td>{weight.avg7day}</td>
                                <td>{dateString}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        )
    }

    const renderNewWeight = () => {
        console.log("RENDER NEW WEIGHT")
    }

    useEffect(() => {
        fetchWeights()
    }, [])

    return (
    <div className="pageComponent">
        <div>CHART</div>
        {weights[0] ? renderTable() : null}
        {newWeight ? renderNewWeight() : null}
        <button className="actionButton moduleButton" onClick={()=>setNewWeight(true)}>Add New Weight</button>
        <span className="flagSpan">{flag}</span>
    </div>
    )
}

export default connect()(Weights)