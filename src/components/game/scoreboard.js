import React from 'react'
import { View } from 'react-native'
import { GlobalText } from '../../components/globalText'
import Timer from './timer'

export const Scoreboard = (props) => {
  return(
    <View style={props.scoreboardStyle}>
      <View style={props.blueStyle}>
        <GlobalText
          value={`${props.blueScore}   |   ${props.blueTotal}`}
          style={props.textStyle}
        />
      </View>
      <View style={props.redStyle}>
        <GlobalText
          value={`${props.redScore}   |   ${props.redTotal}`}
          style={props.textStyle}
        />
      </View>
      <Timer
        gameId={props.gameId}
      />
    </View>
  )
}