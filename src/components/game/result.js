import React from 'react'
import { View, Image, StyleSheet, Text } from 'react-native'
import { fonts, colors } from '../../utils/styles'
import FlipCard from 'react-native-flip-card'

const agents = require('../../assets/images/fieldagentIconWhite.png')
const spymaster = require('../../assets/images/spymasterIconWhite.png')
const resultBackground = require('../../assets/images/whiteFog.png')

export const Result = (props) => {

  renderSpymasterIcon = (props) => {
      return (
        <Image
          source={spymaster}
          style={style(props.orientation).icon}
        />
      )
  }

  renderFieldAgents = () => {
    switch (props.result) {
      case 'Red team wins!':
        return (
          <Image
            source={agents}
            style={style(props.orientation).icon}
          />
        )
      case 'Blue team wins!':
        return (
          <Image
            source={agents}
            style={style(props.orientation).icon}
          />
        )
      case 'Assassin contacted. Game over.':
        return (
          <Image
            source={spymaster}
            style={style(props.orientation).icon}
          />
        )
    }
  }

  renderRoleBasedIcon = () => {
    if (props.role === "sypmaster") { 
      return this.renderSpymasterIcon()
    } else {
      return this.renderFieldAgents()
    }
  }

  renderResultBackground = () => {
    return (
      <Image
        source={resultBackground}
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
            <Text style={style(props.orientation).resultText}>
              {props.result}
            </Text>
          </View>
      </FlipCard>
    </View>
  )
}

const style = (orientation, result = null) => {
  let winnerBackground
  (result === 'Red team wins!') ? winnerBackground = colors["red-agent"]
    : (result === 'Blue team wins!') ? winnerBackground = colors["blue-agent"]
    : (result === 'Assassin contacted. Game over.') ? winnerBackground = 'black'
    : null
  return StyleSheet.create({
    resultWrapper: {
      flex: 1,
      marginTop: 10,
      marginBottom: (orientation === 'portrait') ? 50 : 68,
      marginLeft: (orientation === 'portrait') ? 0 : 12
    },
    card: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: winnerBackground,
      borderRadius: 8,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'white'
    },
    icon: {
      alignSelf: (orientation === 'portrait') ? 'flex-start' : 'flex-end',
      marginRight: (orientation === 'portrait') ? 0 : 30,
      height: (orientation === 'portrait') ? '85%' : '60%',
      width: 50,
      resizeMode: 'contain',
      position: 'absolute',
      opacity: 0.7
    },
    resultText: {
      alignSelf: (orientation === 'portrait') ? null : 'flex-start',
      paddingLeft: (orientation === 'portrait') ? null : 20,
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