import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import axios from 'axios';
import * as env from '../env'
import {VictoryChart, VictoryLine, VictoryAxis, VictoryLabel, VictoryTooltip, VictoryVoronoiContainer} from 'victory'

const Weights = (props) => {

    const [weights, setWeights] = useState([])
    const [addWeight, setAddWeight] = useState(false)
    const [newWeight, setNewWeight] = useState({
        babyId: props.baby.id,
        date: "",
        weight: 0,
        deltaDay: 0,
        deltaBirthWeight: 0,
        avg7day: 0
    })

    const [flag, setFlag] = useState("")
    const [chart, setChart] = useState({
        weight: true,
        deltaDay: true,
        deltaBirthWeight: true,
        avg7day: true
    })

    const fetchWeights = () => {
        axios.post(`${env.serverUrl}/b/weight/all`, {babyId: props.baby.id})
        .then(res => {
            if (res.data.weights) {
                const processedWeights = res.data.weights.map(weight => {

                    let [dateString, lifeDay] = processDate (weight.date)

                    return ({
                        ...weight,
                        dateString: dateString,
                        lifeDay: lifeDay
                    })
                })
                setWeights(sortWeights(processedWeights))
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

        let lifeDay = Math.ceil((weightDate - birthDate)/86400000)

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

    const renderChart = () => {

        const getMinMax = (path) => {
            let min = Math.min(...weights.map(weight => weight[path]))
            let max = Math.max(...weights.map(weight => weight[path]))

            return [min, max]
        }


        let minMax = {
            weight: getMinMax("weight"),
            deltaDay: getMinMax("deltaDay"),
            deltaBirthWeight: getMinMax("deltaBirthWeight"),
            avg7day: getMinMax("avg7Day")
        }

        const renderWeightLine = () => {
            return (
                <VictoryLine
                    data={weights}
                    x="lifeDay"
                    y={datum => (datum.weight - minMax.weight[0]) / (minMax.weight[1] - minMax.weight[0])}
                    labels={({datum}) => `${datum.weight} kg`}
                    labelComponent={<VictoryTooltip />}
                    style={{
                        data: {stroke: "#3B3B98", strokeWidth: ({active}) => active ? 4 : 2}
                    }}
                />
            )
        }

        const renderDeltaDayLine = () => {
            return (
                <VictoryLine
                    data={weights}
                    x="lifeDay"
                    y={datum => (datum.deltaDay - minMax.deltaDay[0]) / (minMax.deltaDay[1] - minMax.deltaDay[0])}
                    labels={({datum}) => `Daily Change\n${datum.deltaDay} g`}
                    labelComponent={<VictoryTooltip />}
                    style={{
                        data: {stroke: "#F97F51", strokeWidth: ({active}) => active ? 4 : 2}
                    }}
                />
            )
        }

        const renderDeltaBirthWeightLine = () => {
            return (
                <VictoryLine
                    data={weights}
                    x="lifeDay"
                    y={datum => (datum.deltaBirthWeight / 1000 + 0.1 * weights[0].weight) / (weights[0].weight * 0.2)}
                    labels={({datum}) => `Change from birth\n${datum.deltaBirthWeight} g`}
                    labelComponent={<VictoryTooltip />}
                    style={{
                        data: {stroke: "#B33771", strokeWidth: ({active}) => active ? 4 : 2}
                    }}
                />
            )
        }

        const renderAvg7DayLine = () => {
            return (
                <VictoryLine
                    data={weights}
                    x="lifeDay"
                    y={datum => (datum.avg7day - minMax.deltaDay[0]) / (minMax.deltaDay[1] - minMax.deltaDay[0])}
                    labels={({datum}) => `7 Day Avg.\n${datum.avg7day} g`}
                    labelComponent={<VictoryTooltip />}
                    style={{
                        data: {stroke: "#009432", strokeWidth: ({active}) => active ? 4 : 2}
                    }}
                />
            )
        }


        return (        
        <div className="chartDiv">
            <VictoryChart
                containerComponent={<VictoryVoronoiContainer/>}
                domain={{y: [0, 1]}}
            >
                <VictoryLabel x={15} y={24} text="Weight (kg)" />
                <VictoryLabel x={325} y={24} text="Weight Change (g)" />
                <VictoryAxis
                    domain={[1, weights[weights.length - 1].lifeDay]}
                    label="Day of Life"
                    orientation="bottom"
                    style={{
                        axisLabel: {padding: 30}
                    }}
                />
                {/* weight data set */}
                <VictoryAxis dependentAxis
                    orientation="left"
                    style={{
                        axisLabel: {padding: 40}
                    }}
                    tickValues={[0.25, 0.5, 0.75, 1]}
                    tickFormat={t => (t * (minMax.weight[1] - minMax.weight[0]) + minMax.weight[0]).toFixed(3)}
                />

                <VictoryAxis dependentAxis
                    orientation="right"
                    style={{
                        axisLabel: {padding: 30}
                    }}
                    tickValues={[0.25, 0.5, 0.75, 1]}
                    tickFormat={t => (t * (minMax.deltaDay[1] - minMax.deltaDay[0]) + minMax.deltaDay[0]).toFixed(3)}
                />

                {chart.weight ? renderWeightLine() : null}
                {chart.deltaDay ? renderDeltaDayLine() : null}
                {chart.deltaBirthWeight ? renderDeltaBirthWeightLine() : null}
                {chart.avg7day ? renderAvg7DayLine() : null}

                {/* deltaDay data set */}




            </VictoryChart>
            <div className="chartButtonsDiv">
                <button className={chart.weight ? "chartButton weight" : "chartButton"} onClick={() => toggleChart("weight")}>Weight</button>
                <button className={chart.deltaDay ? "chartButton deltaDay" : "chartButton"} onClick={() => toggleChart("deltaDay")}>Daily Change</button>
                <button className={chart.deltaBirthWeight ? "chartButton deltaBirthWeight" : "chartButton"} onClick={() => toggleChart("deltaBirthWeight")}>BW Change</button>
                <button className={chart.avg7day ? "chartButton avg7day" : "chartButton"} onClick={() => toggleChart("avg7day")}>7 Day Avg</button>
            </div>
        </div>
        )
    }

    const toggleChart = (line) => {
        let bool = true

        if (chart[line]) {
            bool = false
        }

        setChart({
            ...chart,
            [line]: bool
        })
    }

    const renderTable = () => {
        return (
            <React.Fragment>
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
                    <tr className="unitRow">
                        <td>day</td>
                        <td>kg</td>
                        <td>g</td>
                        <td>g</td>
                        <td>g/day</td>
                        <td></td>
                    </tr>
                    {weights.map((weight) => {

                        return (
                            <tr key={weight.id}>
                                <td>{weight.lifeDay}</td>
                                <td>{weight.weight}</td>
                                <td>{weight.deltaDay}</td>
                                <td>{weight.deltaBirthWeight}</td>
                                <td>{weight.avg7day}</td>
                                <td>{weight.dateString}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
            <span className="arrow">>>></span>
            </React.Fragment>
        )
    }

    const renderAddWeight = () => {
        return (
            <div className="passwordDiv newWeightDiv">
                <span className="smallHeading">Add Weight</span>
                <div className="inputDiv">
                    <label htmlFor="weight">{"Weight (kg)"}</label>
                    <input className="numInput" type="number" name="weight" onChange={handleChange} />
                </div>
                <div className="inputDiv">
                    <label htmlFor="date">Date Recorded</label>
                    <input type="date" name="date" value={newWeight.date} onChange={handleChange} />
                </div>
                <div className="pwButtonsDiv">
                    <button className="actionButton" onClick={()=>setAddWeight(false)}>Cancel</button>
                    <button className="actionButton deleteButton" onClick={handleSubmit}>Add Weight</button>
                </div>
            </div>
        )
    }

    const handleChange = (e) => {
        setNewWeight({
            ...newWeight,
            [e.target.name]: e.target.value
        })
    }

    const calcAvg7Day = (weight, lifeDay) => {

        if (!weights[0]) {
            return 0
        }

        if (lifeDay < 7) {
            //  g/kg/day
            if (weight < 2) {
                return (weight - weights[0].weight) * 1000 / weight / lifeDay
            } else {
                return (weight - weights[0].weight) * 1000 / lifeDay
            }
        } else {
            //  g/day
            if (weight < 2) {
                return (weight - weights[weights.length - 6].weight) * 1000 / weight / 7
            } else {
                return (weight - weights[weights.length - 6].weight) * 1000 / 7
            }
        }



    }

    const handleSubmit = () => {
        let weight = parseFloat(newWeight.weight)
        let lifeDay = processDate(newWeight.date)[1]

        let processedWeight = {
            babyId: props.baby.id,
            date: newWeight.date,
            weight: weight,
            deltaDay: ((weight - weights[weights.length - 1].weight) * 1000).toFixed(3),
            deltaBirthWeight: ((weight - weights[0].weight) * 1000).toFixed(3),
            avg7day: (calcAvg7Day(weight, lifeDay)).toFixed(3)
        }

        addNewWeight(processedWeight)
    }

    const addNewWeight = (finalWeight) => {
        axios.post(`${env.serverUrl}/b/weight`, finalWeight)
        .then(res => {
            if (res.data.weight) {
                setAddWeight(false)
                fetchWeights()
            } else if (res.data.error) {
                setFlag(res.data.error)
            } else {
                setFlag('Unable to add weight')
            }
        })
    }

    useEffect(() => {
        fetchWeights()
    }, [])

    return (
    <div className="pageComponent">
        <div className="headingDiv">
            <span className="smallHeading weight">Room {props.baby.roomNum}</span>
            {addWeight ? null : <button className="actionButton moduleButton" onClick={()=>setAddWeight(true)}>Add New Weight</button>}
        </div>
        {weights[0] ? renderChart() : null}
        {weights[0] ? renderTable() : null}
        {addWeight ? renderAddWeight() : null}
        <span className="flagSpan">{flag}</span>
    </div>
    )
}

export default connect()(Weights)