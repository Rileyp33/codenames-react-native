import React from 'react'
import { View, Image, StyleSheet, Text } from 'react-native'
import { fonts } from '../../utils/styles'
import FlipCard from 'react-native-flip-card'

const redAgents = require('../../assets/images/fieldagentIconRed.png')
const blueAgents = require('../../assets/images/fieldagentIconBlue.png')
const spymaster = require('../../assets/images/spymasterIcon.png')
const spymasterRed = require('../../assets/images/spymasterIconRed.png')
const spymasterBlue = require('../../assets/images/spymasterIconBlue.png')
const resultBackground = require('../../assets/images/whiteFog.png')

export const Result = (props) => {

  renderSpymasterIcon = (props) => {
    switch (props.result) {
      case 'Red team wins!':
        return (
          <Image
            source={spymasterRed}
            style={style(props.orientation).icon}
          />
        )
      case 'Blue team wins!':
        return (
          <Image
            source={spymasterBlue}
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

  renderFieldAgents = () => {
    switch (props.result) {
      case 'Red team wins!':
        return (
          <Image
            source={redAgents}
            style={style(props.orientation).icon}
          />
        )
      case 'Blue team wins!':
        return (
          <Image
            source={blueAgents}
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
          <View style={style(props.orientation).card}>
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

const style = (orientation) => {
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
      backgroundColor: 'white',
      borderRadius: 8,
      overflow: 'hidden'
    },
    icon: {
      alignSelf: (orientation === 'portrait') ? 'flex-start' : 'flex-end',
      height: (orientation === 'portrait') ? '85%' : '55%',
      width: 50,
      resizeMode: 'contain',
      position: 'absolute'     
    },
    resultText: {
      alignSelf: (orientation === 'portrait') ? null : 'flex-start',
      paddingLeft: (orientation === 'portrait') ? null : 28,
      fontSize: 20,
      fontFamily: fonts.homeButtons,
      fontWeight: 'bold', 
      maxWidth: (orientation === 'portrait') ? null : 140
    },
    resultBackground: {
      width: '100%',
      resizeMode: 'contain',
      position: 'absolute',
      opacity: 0.9
    }
  })
}