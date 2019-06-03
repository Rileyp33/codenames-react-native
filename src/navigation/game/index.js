import React from 'react'
import { Text } from 'react-native'
import { apiCall } from '../../utils/requests'

export default class GameScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Text style={{alignSelf: 'center', marginTop: 200}}>{this.props.navigation.getParam('gameId')}</Text>
    )
  }
}