import React from 'react'
import { Text } from 'react-native'
import { apiCall, endpoints } from '../../utils/requests'

export default class GameScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  getGameState = (response) => {
    console.log(response)
  }

  componentDidMount() {
    apiCall(this.getGameState, endpoints.local_games, 3)
  }

  render() {
    return (
      <Text>GameScreen</Text>
    )
  }
}