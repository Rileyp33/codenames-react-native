import React from 'react'
import { View, Image, StyleSheet, Text } from 'react-native'
import { fonts, colors } from '../../utils/styles'
import FlipCard from 'react-native-flip-card'

const resultBackground = require('../../assets/images/white_fog.png')

export const Result = (props) => {

  renderSpymasterIcon = (props) => {
      return (
        <Image
          source={{ uri: 'spymaster_icon_white' }}
          style={style(props.orientation, props.result, props.role).icon}
        />
      )
  }

  renderFieldAgents = (props) => {
    switch (props.result) {
      case 'Red team wins!':
        return (
          <Image
            source={{ uri: 'field_agent_icon_white' }}
            style={style(props.orientation, props.result, props.role).icon}
          />
        )
      case 'Blue team wins!':
        return (
          <Image
            source={{ uri: 'field_agent_icon_white' }}
            style={style(props.orientation, props.result, props.role).icon}
          />
        )
      case 'Assassin contacted. Game over.':
        return (
          <Image
            source={{ uri: 'spymaster_icon_white' }}
            style={style(props.orientation, props.result, props.role).icon}
          />
        )
    }
  }

  renderRoleBasedIcon = (props) => {
    if (props.role === "spymaster") { 
      return renderSpymasterIcon(props)
    } else {
      return renderFieldAgents(props)
    }
  }

  renderResultBackground = (props) => {
    return (
      <Image
        source={resultBackground}
        width={1000}
        height={1000}
        style={style(props.orientation).resultBackground}
      />
    )
  }

  return (
    <View style={style(props.orientation).resultWrapper}>
      <FlipCard
        clickable={false}
        friction={2}
        perspective={1000}
        flipHorizontal={true}
        flipVertical={true}
        useNativeDriver={true}
        flip={typeof props.result === 'string'}>
          <View></View>
          <View style={style(props.orientation, props.result).card}>
            {renderResultBackground(props)}
            {renderRoleBasedIcon(props)}
            <Text style={style(props.orientation, props.result).resultText}>
              {props.result}
            </Text>
          </View>
      </FlipCard>
    </View>
  )
}

const style = (orientation, result = null, role = null) => {
  let winnerBackground
  (result === 'Red team wins!') ? winnerBackground = colors["red-agent"]
    : (result === 'Blue team wins!') ? winnerBackground = colors["blue-agent"]
    : (result === 'Assassin contacted. Game over.') ? winnerBackground = 'black'
    : null
  return StyleSheet.create({
    resultWrapper: {
      flex: 1,
      marginTop: 10,
      marginLeft: (orientation === 'portrait') ? 3 : 12,
      marginRight: 3
    },
    card: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: winnerBackground,
      borderRadius: 8,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.darkGray
    },
    icon: {
      alignSelf: (orientation === 'portrait') ? 'flex-start' : 'flex-end',
      height: (orientation === 'portrait') ? '85%' : '85%',
      width: (role === 'spymaster') ? 50 : (result === "Assassin contacted. Game over.") ? 50 : 25,
      resizeMode: 'contain',
      position: 'absolute',
      right: (orientation === 'portrait') ? null : (role === 'spymaster') ? 3 : (result === "Assassin contacted. Game over.") ? 3 : 8,
      opacity: 0.7
    },
    resultText: {
      alignSelf: (orientation === "portrait" && result === "Assassin contacted. Game over."
      ) ? 'flex-end' : (orientation === 'portrait') ? null : 'flex-start',
      paddingLeft: (orientation === 'portrait') ? null : 14,
      paddingRight: (orientation === "portrait" && result === "Assassin contacted. Game over."
      ) ? 10 : null,
      fontSize: 20,
      fontFamily: fonts.main,
      fontWeight: 'bold', 
      maxWidth: (orientation === 'portrait') ? null : 140,
      color: 'white'
    },
    resultBackground: {
      width: (orientation === 'portrait') ? '100%' : '135%',
      resizeMode: 'contain',
      position: 'absolute',
      opacity: 0.3
    }
  })
}