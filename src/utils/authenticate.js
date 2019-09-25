import axios from 'axios'

export function setAuthenticationHeader(token) {
    token ? axios.defaults.headers.common['Authorization'] = `Bearer ${token}` : delete axios.defaults.headers.common['Authorization']
}