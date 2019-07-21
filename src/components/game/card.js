import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { GlobalText } from '../globalText'

export const Card = (props) => {

  renderFlippedImage = (props) => {
    switch (props.color) {
      case 'red-agent':
        return (
          <Image
            source={require('../../assets/images/redagent.jpg')}
            style={props.imageStyle}
          />
        )
      case 'blue-agent':
        return (
          <Image
            source={require('../../assets/images/blueagent.jpg')}
            style={props.imageStyle}
          />
        )
      case 'civilian':
        return (
          <Image
            source={require('../../assets/images/civilian.jpg')}
            style={props.imageStyle}
          />
        )
      case 'assassin':
        return (
          <Image
            source={require('../../assets/images/Assassin.png')}
            style={props.imageStyle}
          />
        )
    }
  }

  return (
    <TouchableOpacity
      key={props.key}
      onPress={props.onPress}
      style={props.cardStyle}>
      {(props.flippedStatus === 'up') ? renderFlippedImage(props) : null}
      <GlobalText
        value={props.value}
        style={props.textStyle}>
      </GlobalText>
    </TouchableOpacity>
  )
}