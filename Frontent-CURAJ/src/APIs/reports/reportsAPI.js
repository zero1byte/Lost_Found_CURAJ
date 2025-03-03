import axios from "axios"
import { SERVER_URL } from "../../constants.astro"
import { setComplains } from '../../store.js'
export const ReportsAPIs = async (route, data) => {
    return await axios.post(SERVER_URL() + '/reports' + route, data, { withCredentials: true }).then(({ data }) => {
        if (!data) {
            return { message: "something wrong", response: false, data }
        }
        console.log(data);
        return data;
    }).catch(({ response }) => {
        if (!response) {
            return { message: "something wrong", response: false, data: response }
        }
        return (response?.data);
    })
}

export const ReportsGetRequests = async (route) => {
    return await axios.get(SERVER_URL() + '/reports' + route, { withCredentials: true }).then(({ data }) => {
        if (!data || !data.data) {
            return { message: "something wrong", response: false, data }
        }
        setComplains(data.data);

        return data;
    }).catch(({ response }) => {
        if (!response) {
            return { message: "something wrong", response: false, data: response }
        }
        return (response?.data);
    })
} 