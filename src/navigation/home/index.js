import React from 'react'
import { View, StyleSheet, ImageBackground, Image } from 'react-native'
import { Button, Icon } from 'react-native-elements'

export default class HomeScreen extends React.Component{
  constructor(props) {
    super(props)
    this.state = {}
  }

  renderLogo = () => {
    return (
      <View style={style.logoWrapper}>
        <Image
          source={require('codenamesReactNative/src/assets/images/CodenamesLogoWhite.png')}
          style={style.logo}>
        </Image>
      </View>
    )
  }

  renderButtons = () => {
    return ( 
      <View style={style.buttonsWrapper}>
        <Button
          title='New Game'
          onPress={() => this.props.navigation.navigate('Game')}
          type='solid'
          containerStyle={style.buttonContainer}
          buttonStyle={style.button}
          titleStyle={style.buttonTitle}
          raised={true}
          iconLeft
          icon={{
            type: 'material-community',
            name: 'cards-playing-outline',
            size: 30,
            color: 'gray',
            paddingRight: 15
          }}
        />
        <Button
          title='Join Game'
          type='solid'
          containerStyle={style.buttonContainer}
          buttonStyle={style.button}
          titleStyle={style.buttonTitle}
          raised={true}
          iconLeft
          icon={{
            type: 'antdesign',
            name: 'addusergroup',
            size: 30,
            color: 'gray',
            paddingRight: 15
          }}
        />
        <Button
          title='Rules'
          type='solid'
          containerStyle={style.buttonContainer}
          buttonStyle={style.button}
          titleStyle={style.buttonTitle}
          raised={true}
          iconLeft
          icon={{
            type: 'material-community',
            name: 'sign-text',
            size: 30,
            color: 'gray',
            paddingRight: 15
          }}
        />
      </View>
    )
  }

  render() {
    return(
      <ImageBackground
        source={require('codenamesReactNative/src/assets/images/OrangeBackground.jpg')}
        style={style.imageBackground}
        imageStyle={style.imageStyle}>
          <View style={style.screenContainer}>
            {this.renderLogo()}
            {this.renderButtons()}
          </View>
      </ImageBackground>
    )
  }
}

const style = StyleSheet.create({
  screenContainer: {
    flex: 1,
    alignItems: 'center'
  },  
  imageBackground: {
    width: '100%',
    height: '100%'
  },
  imageStyle: {
    resizeMode: 'cover'
  },
  buttonsWrapper: {
    flex: 1,
    justifyContent: 'center'
  },
  buttonContainer: {
    width: 300,
    marginTop: 10
  },
  button: {
    borderRadius: 8,
    backgroundColor: 'white'
  },  
  buttonTitle: {
    color: 'black',
    fontFamily: 'AvenirNextCondensed-Medium',
    fontSize: 16,
  },
  logoWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20
  },
  logo: {
    flex: 1,
    resizeMode: 'contain',
    alignSelf: 'center'
  }
})