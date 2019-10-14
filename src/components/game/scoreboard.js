import React from 'react'
import { View } from 'react-native'
import { GlobalText } from '../global/globalText'
import Timer from './timer'

export const Scoreboard = (props) => {
  const portraitTextBlue = `${props.blueScore}    |    ${props.blueTotal}`
  const landscapeTextBlue = `${props.blueScore}  |  ${props.blueTotal}`
  const portraitTextRed = `${props.redScore}    |    ${props.redTotal}`
  const landscapeTextRed = `${props.redScore}  |  ${props.redTotal}`
  
  return(
    <View style={props.scoreboardStyle}>
      <View style={props.blueStyle}>
        <GlobalText
          value={(props.orientation === 'portrait') ? portraitTextBlue : landscapeTextBlue}
          style={props.textStyle}
        />
      </View>
      <View style={props.redStyle}>
        <GlobalText
          value={(props.orientation === 'portrait') ? portraitTextRed : landscapeTextRed}
          style={props.textStyle}
        />
      </View>
      <Timer
        gameId={props.gameId}
      />
    </View>
  )
}