import axios from 'axios'

export const BASE_URL = 'http://10.0.0.35:3000/api/v1/'

export async function apiCall(body, method, urlSuffix, contentType = 'application/JSON') {
  console.log(`Hitting endpoint: ${BASE_URL + urlSuffix}`)
  return axios({
    method: method,
    url: BASE_URL + urlSuffix,
    data: body,
    headers: {
      'content-type': contentType
    }
  })
  .then((response) => {
    console.log('Response: ', response)
    return response
  })
  .catch((error) => {
    console.log('Request error: ', error)
  })
}