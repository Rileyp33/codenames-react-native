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
            source={require('../../assets/images/blackagent.jpg')}
            style={props.imageStyle}
          />
        )
    }
  }

  renderSpymasterImage = (props) => {
    switch (props.color) {
      case 'red-agent':
        return (
          <Image
            source={require('../../assets/images/redSpymasterCard.jpg')}
            style={props.imageStyle}
          />
        )
      case 'blue-agent':
        return (
          <Image
            source={require('../../assets/images/blueSpymasterCard.jpg')}
            style={props.imageStyle}
          />
        )
      case 'civilian':
        return (
          <Image
            source={require('../../assets/images/tanSpymasterCard.jpg')}
            style={props.imageStyle}
          />
        )
      case 'assassin':
        return (
          <Image
            source={require('../../assets/images/BlackTexturedBackground.jpg')}
            style={props.imageStyle}
          />
        )
    }
  }

  renderUnflippedImage = () => {
    return (
      <Image
        source={require('../../assets/images/grayCard.jpg')}
        style={props.imageStyle}
      />
    )
  }

  renderRoleBasedImage = () => {
    if (props.role === "spymaster") {
      return this.renderSpymasterImage(props)
    } else {
      return (props.flippedStatus === 'up') ? renderFlippedImage(props) : renderUnflippedImage()
    }
  }

  formatText = (value) => {
    if(props.orientation === 'portrait') {
      if (value && value.length > 6) {
        return (
          value.slice(0, 6) + '-\n' + value.slice(6)
        )
      } else {
        return value
      }
    } else { 
        if (value && value.length > 8) {
          return (
            value.slice(0, 8) + '-\n' + value.slice(8)
          )
        } else {
          return value
        }
    }
  }

  return (
    <TouchableOpacity
      key={props.key}
      onPress={props.onPress}
      style={props.cardStyle}>
      {renderRoleBasedImage()}
      <GlobalText
        value={formatText(props.value)}
        style={props.textStyle}>
      </GlobalText>
    </TouchableOpacity>
  )
}