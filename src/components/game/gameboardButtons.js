import React from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-elements'
import { colors } from '../../utils/styles'

export const GameboardButtons = (props) => {
  return (
    <View style={props.buttonsWrapper}>
      <Button
        title={'Home'}
        // onPress={() => this.createGame()}
        type={'solid'}
        containerStyle={props.buttonContainer}
        buttonStyle={props.buttonStyle}
        titleStyle={props.buttonTitle}
        raised={true}
        icon={{
          type: 'entypo',
          name: 'home',
          size: 20,
          color: 'black',
          paddingRight: 8,
          marginLeft: -6
        }}
      />
      <Button
        title={'Rules'}
        // onPress={() => console.log('tbd')}
        type={'solid'}
        containerStyle={props.buttonContainer}
        buttonStyle={props.buttonStyle}
        titleStyle={props.buttonTitle}
        raised={true}
        icon={{
          type: 'material-community',
          name: 'sign-text',
          size: 20,
          color: 'black',
          paddingRight: 8,
          marginLeft: -6
        }}
      />
      <Button
        title={(props.orientation === 'portrait') ? 'Toggle Role' : 'Role'}
        // onPress={() => this.tempJoinGame()}
        type={'solid'}
        containerStyle={props.buttonContainer}
        buttonStyle={props.buttonStyle}
        titleStyle={props.buttonTitle}
        raised={true}
        icon={{
          type: 'material-community',
          name: 'account-key',
          size: 20,
          color: 'black',
          paddingRight: 8,
          marginLeft: -6
        }}
      />
    </View>
  )
}