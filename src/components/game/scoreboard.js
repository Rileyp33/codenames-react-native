import React from 'react'
import { View } from 'react-native'
import { GlobalText } from '../../components/globalText'
import { Icon } from 'react-native-elements'
import { colors } from '../../utils/styles'

export const Scoreboard = (props) => {
  return(
    <View style={props.scoreboardStyle}>
      <View style={props.redStyle}>
        <GlobalText
          value={`${props.blueScore}    |    ${props.blueTotal}`}
          style={props.textStyle}
        />
      </View>
      <View style={props.blueStyle}>
        <GlobalText
          value={`${props.redScore}    |    ${props.redTotal}`}
          style={props.textStyle}
        />
      </View>
      <View style={props.timerWrapper}>
        <Icon
          type={'ionicon'}
          name={'ios-hourglass'}
          size={props.iconSize}
          color={'black'}
        />
      </View>
    </View>
  )
}