import axios from 'axios'

const BASE_URL = 'http://10.0.0.164:3000/api/v1/'

export const endpoints = {
  local_games: 'local_games/'
}

export function apiCall(responseFxn, urlSuffix, id = null) {
    console.log(`Hitting endpoint: ${BASE_URL + urlSuffix + id}`)
    return axios.get(BASE_URL + urlSuffix + id)
      .then((response) => {
        responseFxn(response);
      })
      .catch((error) => {
        console.log(error)
      })
  }