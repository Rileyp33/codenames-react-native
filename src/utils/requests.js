import axios from 'axios'

export const BASE_URL = 'https://codenames-api-rp.herokuapp.com/api/v1/'
// export const BASE_URL = 'http://0.0.0.0:3001/api/v1/'

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