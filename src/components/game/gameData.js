import React from 'react'
import { View } from 'react-native'
import { GlobalText } from '../../components/globalText'

export const GameData = (props) => {
  return (
    <View style={props.dataWrapper}>
      <View style={props.idWrapper}>
        <GlobalText
          value={`Game ID:  ${props.gameId}`}
          style={props.textStyle}
        />
      </View>
      <View style={props.codeWrapper}>
        <GlobalText
          value={`Code:  ${props.gameCode}`}
          style={props.textStyle}
        />
      </View>
    </View>
  )
}