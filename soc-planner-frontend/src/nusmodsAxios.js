import axios from 'axios'

const instance = axios.create({
    baseURL: "https://api.nusmods.com/v2"
})

export default instance