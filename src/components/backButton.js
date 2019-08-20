import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'

const BackButton = (props) => {
  return (
    <View style={style().buttonsWrapper}>
      <Button
        onPress={() => props.navigation.goBack()}
        type={'clear'}
        containerStyle={style(props.orientation).buttonContainer}
        buttonStyle={style().button}
        titleStyle={style().buttonTitle}
        raised={true}
        icon={{
          type: 'ionicon',
          name: 'ios-arrow-back',
          size: 32,
          color: 'white'
        }}
      />
    </View>
  )
}

const style = (orientation = null) => {
  return StyleSheet.create({
    buttonsWrapper: {
      zIndex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute'
    },
    buttonContainer: {
      width: 44,
      margin: (orientation === 'portrait') ? 25 : 12,
      marginLeft: 10
    },
    button: {
      borderRadius: 8,
      backgroundColor: 'black',
      opacity: 0.8
    }
  })
}

export default BackButton