import axios from "axios";
import { BACKEND_URL } from "./socket";

export const axiosInstance = axios.create({
    baseURL: `${BACKEND_URL}/api`,
    withCredentials: true
})
