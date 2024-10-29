import axios from "axios"

const Instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
});


export default Instance;