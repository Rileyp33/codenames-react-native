import React from 'react'
import {Text} from 'react-native'
import axios from 'axios'

export default class HomeScreen extends React.Component{
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    axios.get('http://10.0.0.164:3000/api/v1/local_games/3')
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render() {
    return(
      <Text>HomeScreen</Text>
    )
  }
}