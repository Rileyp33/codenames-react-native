import React from 'react'
import { View } from 'react-native'
import { GlobalText } from '../global/globalText'

export const GameData = (props) => {
  return (
    <View style={props.dataWrapper}>
      <View style={props.idWrapper}>
        <GlobalText
          value={`ID:  ${props.gameId}`}
          style={props.textStyle}
        />
      </View>
      <View style={props.codeWrapper}>
        <GlobalText
          value={`Codename:  ${props.codename}`}
          style={props.textStyle}
        />
      </View>
    </View>
  )
}