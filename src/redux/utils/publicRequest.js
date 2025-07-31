import axios from 'axios'

const publicRequest = (method, url, data, contentType) => {
	return axios.request({
		url,
		method,
		params: method === 'get' ? data : null,
		data: method !== 'get' ? data : null,
		headers: {
			'Content-Type': contentType,
			'Access-Control-Allow-Origin': "*",
			'Access-Control-Allow-Methods':"*"
		}
	})
}

export default publicRequest