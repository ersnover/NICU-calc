import React, {useState, useEffect} from 'react'
import axios from 'axios'
import * as env from '../env'
import { connect } from 'react-redux'
import BabyCard from './babyCard'

const MyBabies = (props) => {

    const [babies, setBabies] = useState([])
    const [message, setMessage] = useState('')

    const fetchBabies = () => {
        axios.post(`${env.serverUrl}/b/all`, {docId: props.docId})
        .then(res => {
            if (res.data.babies) {
                setBabies(res.data.babies)
            } else if (res.data.message) {
                setMessage(res.data.message)
            } else {
                setMessage('Error loading babies')
            }
        })
    }

    useEffect(() => {
        fetchBabies()
    }, [])

    return (
        <div className="pageComponent myBabiesDiv">
            {babies.map((baby, i) => <BabyCard key={i} baby={baby} />)}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        docId: state.docId
    }
}

export default connect(mapStateToProps)(MyBabies)