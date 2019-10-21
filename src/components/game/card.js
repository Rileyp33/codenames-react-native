import React from 'react'
import { TouchableOpacity, Image, Animated, Platform, View } from 'react-native'
import { GlobalText } from '../global/globalText'
import { colors } from '../../utils/styles'
import FlipCard from 'react-native-flip-card'

export default class Card extends React.Component {
  constructor(props) {
    super(props)
    this.flippedOperativePosition = new Animated.Value(0)
  }

  flip = async () => {
    await this.props.onPress()
    await this.animate()
  }

  animate = async () => {
    this.flippedOperativePosition.setValue(0)
    Animated.timing(this.flippedOperativePosition, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
      perspective: 1000,
    }).start(() => { return true })
  }

  renderFlippedOperativeImage = (props) => {
    switch (props.color) {
      case 'red-agent':
        return (
          <Image
            source={{ uri: 'red_agent' }}
            style={props.imageStyle}
          />
        )
      case 'blue-agent':
        return (
          <Image
            source={{ uri: 'blue_agent' }}
            style={props.imageStyle}
          />
        )
      case 'civilian':
        return (
          <Image
            source={{ uri: 'civilian' }}
            style={props.imageStyle}
          />
        )
      case 'assassin':
        return (
          <Image
            source={{ uri: 'black_agent' }}
            style={props.imageStyle}
          />
        )
    }
  }

  renderUnflippedSpymasterImage = (props) => {
    switch (props.color) {
      case 'red-agent':
        return (
          <Image
            source={{ uri: 'red_spymaster_card' }}
            style={props.imageStyle}
          />
        )
      case 'blue-agent':
        return (
          <Image
            source={{ uri: 'blue_spymaster_card' }}
            style={props.imageStyle}
          />
        )
      case 'civilian':
        return (
          <Image
            source={{ uri: 'tan_spymaster_card' }}
            style={props.imageStyle}
          />
        )
      case 'assassin':
        return (
          <Image
            source={{ uri: 'black_textured_background' }}
            style={props.imageStyle}
          />
        )
    }
  }

  renderFlippedSpymasterImage = (props) => {
    switch (props.color) {
      case 'red-agent':
        return (
          <Image
            source={{ uri: 'red_spymaster_card' }}
            style={props.flippedSpymasterImageStyle}
          />
        )
      case 'blue-agent':
        return (
          <Image
            source={{ uri: 'blue_spymaster_card' }}
            style={props.flippedSpymasterImageStyle}
          />
        )
      case 'civilian':
        return (
          <Image
            source={{ uri: 'tan_spymaster_card' }}
            style={props.flippedSpymasterImageStyle}
          />
        )
      case 'assassin':
        return (
          <Image
            source={{ uri: 'black_textured_background' }}
            style={props.flippedSpymasterImageStyle}
          />
        )
    }
  }

  renderUnflippedImage = (props) => {
    return (
      <Image
        source={{ uri: 'gray_card' }}
        style={props.imageStyle}
      />
    )
  }

  renderRoleBasedImage = () => {
    if (this.props.role === "spymaster") {
      return (this.props.flippedStatus === 'up') ? this.renderFlippedSpymasterImage(this.props) : this.renderUnflippedSpymasterImage(this.props)
    } else {
      return (this.props.flippedStatus === 'up') ? this.renderFlippedOperativeImage(this.props) : this.renderUnflippedImage(this.props)
    }
  }

  formatText = (value) => {
    if (this.props.orientation === 'portrait') {
      if (value && value.length > 8) {
        return (
          value.slice(0, 8) + '-\n' + value.slice(8)
        )
      } else {
        return value
      }
    } else {
      if (value && value.length > 10) {
        return (
          value.slice(0, 10) + '-\n' + value.slice(10)
        )
      } else {
        return value
      }
    }
  }

  renderIOS = () => {
    return (
      <FlipCard
        friction={3}
        perspective={120}
        flipVertical={true}
        useNativeDriver={true}
        flip={this.props.flippedStatus === "up"}>
        <TouchableOpacity
          key={this.props.key}
          onPress={this.props.onPress}
          style={this.props.cardStyle}>
          {this.renderRoleBasedImage()}
          <GlobalText
            value={this.formatText(this.props.value)}
            style={this.props.textStyle}>
          </GlobalText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.props.onPress}
          style={this.props.cardStyle}>
          {this.renderRoleBasedImage()}
          <GlobalText
            value={this.formatText(this.props.value)}
            style={this.props.textStyle}>
          </GlobalText>
        </TouchableOpacity>
      </FlipCard>
    )
  }

  renderAndroid = () => {
    const rotateX = this.flippedOperativePosition.interpolate({
      inputRange: [0, 0.1, 0.5, 0.99, 1],
      outputRange: ['0deg', '0deg', '-90deg', '-0.4deg', '0deg']
    })
    
    return (
      <Animated.View style={{ transform: [{ rotateX }, {perspective: 1000}], flex: 1 }}>
        <TouchableOpacity onPress={() => this.flip()}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.lightGray,
            marginHorizontal: 2,
            marginVertical: 3,
            borderRadius: 5,
            overflow: 'hidden'
          }}>
          {this.renderRoleBasedImage()}
          <GlobalText
            value={this.formatText(this.props.value)}
            style={this.props.textStyle}>
          </GlobalText>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  render() {
    return (Platform.OS === 'ios') ? this.renderIOS() : this.renderAndroid()
  }
}

