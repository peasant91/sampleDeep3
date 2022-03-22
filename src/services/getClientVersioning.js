import axios from 'axios';

const getClientVersioning = axios.create({
    baseURL: "https://android.timedoor.biz/api/v1"
});

getClientVersioning.interceptors.request.use(
    async (config) => {
        config.headers.Accept = "application/json"
        config.headers.ContentType = "application/json"
        return config;
    }, 
    (err) => {
        return Promise.reject(err);
    }
);

getClientVersioning.interceptors.request.use(request => {
    console.log('Starting Request:', JSON.stringify(request, null, 2))
    return request
  })
  
getClientVersioning.interceptors.response.use(response => {
    console.log('Response:', JSON.stringify(response.data, null, 2))
    return response
  })

export default getClientVersioning;