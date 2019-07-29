import React from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-elements'

export const GameboardButtons = (props) => {
  return (
    <View style={props.buttonsWrapper}>
      <Button
        title={(props.orientation === 'portrait') ? 'Home' : null}
        onPress={props.goHome}
        type={'solid'}
        containerStyle={props.buttonContainer}
        buttonStyle={props.buttonStyle}
        titleStyle={props.buttonTitle}
        raised={true}
        icon={{
          type: 'entypo',
          name: 'home',
          size: (props.orientation === 'portrait') ? 20 : 24,
          color: 'black',
          paddingRight: (props.orientation === 'portrait') ? 8 : 0,
          marginLeft: (props.orientation === 'portrait') ? -6 : 0
        }}
      />
      <Button
        title={(props.orientation === 'portrait') ? 'Rules' : null}
        onPress={() => props.navigation.navigate('Rules')}
        type={'solid'}
        containerStyle={props.buttonContainer}
        buttonStyle={props.buttonStyle}
        titleStyle={props.buttonTitle}
        raised={true}
        icon={{
          type: 'material-community',
          name: 'sign-text',
          size: (props.orientation === 'portrait') ? 20 : 24,
          color: 'black',
          paddingRight: (props.orientation === 'portrait') ? 8 : 0,
          marginLeft: (props.orientation === 'portrait') ? -6 : 0
        }}
      />
      <Button
        title={(props.orientation === 'portrait') ? 'Toggle Role' : null}
        onPress={() => props.setRole()}
        type={'solid'}
        containerStyle={props.buttonContainer}
        buttonStyle={props.buttonStyle}
        titleStyle={props.buttonTitle}
        raised={true}
        iconContainerStyle={{alignItems: 'center'}}
        icon={{
          type: 'material-community',
          name: 'account-switch',
          size: (props.orientation === 'portrait') ? 20 : 24,
          color: 'black',
          paddingRight: (props.orientation === 'portrait') ? 8 : 0,
          marginLeft: (props.orientation === 'portrait') ? -6 : 0
        }}
      />
    </View>
  )
}