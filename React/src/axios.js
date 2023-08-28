import axios from 'axios'

const instance = axios.create({
	baseURL: process.env.REACT_APP_API_HOST,
	headers:{
		'Accept':'application/json',
		// 'Content-Type':'application/json',
		'X-Requested-With':'XMLHttpRequest',
	},
	withCredentials: true
}) 

instance.interceptors.request.use((config) =>{
	config.headers.Authorization = ' Bearer ' + window.localStorage.getItem('token');
	return config;
})

export default instance;