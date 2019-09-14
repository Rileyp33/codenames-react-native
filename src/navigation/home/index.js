import React from 'react'
import { View, StyleSheet, ImageBackground, Image, Platform } from 'react-native'
import { Button } from 'react-native-elements'
import { fonts, colors } from '../../utils/styles'

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
          title={'New Game'}
          onPress={() => this.newGame()}
          type={'solid'}
          containerStyle={style.buttonContainer}
          buttonStyle={style.button}
          titleStyle={style.buttonTitle}
          raised={true}
          icon={{
            type: 'material-community',
            name: 'cards-playing-outline',
            size: 30,
            color: colors["red-agent"],
            paddingRight: 20
          }}
        />
        <Button
          title={'Join Game'}
          onPress={() => this.joinGame()}
          type={'solid'}
          containerStyle={style.buttonContainer}
          buttonStyle={style.button}
          titleStyle={style.buttonTitle}
          raised={true}
          icon={{
            type: 'antdesign',
            name: 'addusergroup',
            size: 30,
            color: colors["blue-agent"],
            paddingRight: 20
          }}
        />
        <Button
          title={'Rules'}
          onPress={() => this.showRules()}
          type={'solid'}
          containerStyle={style.buttonContainer}
          buttonStyle={style.button}
          titleStyle={style.buttonTitle}
          raised={true}
          icon={{
            type: 'material-community',
            name: 'sign-text',
            size: 30,
            color: colors.darkGray,
            paddingRight: 20
          }}
        />
      </View>
    )
  }

  renderAssassin = () => {
    return (
      <Image
        source={require('codenamesReactNative/src/assets/images/Assassin.png')}
        style={style.assassin}>
      </Image>
    )
  }

  newGame = async () => {
    this.props.navigation.navigate('NewGame')
  }

  joinGame = () => {
    this.props.navigation.navigate('Lobby')
  }

  showRules = () => {
    this.props.navigation.navigate('Rules')
  }

  render() {
    return(
      <ImageBackground
        source={require('codenamesReactNative/src/assets/images/OrangeBackground.jpg')}
        style={style.imageBackgroundFull}
        imageStyle={style.imageStyleFull}>
          <View style={style.screenContainer}>
            {this.renderLogo()}
            {this.renderAssassin()}
            {this.renderButtons()}
          </View>
      </ImageBackground>
    )
  }
}

const style = StyleSheet.create({
  screenContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 25
  },  
  imageBackgroundFull: {
    width: '100%',
    height: '100%'
  },
  imageStyleFull: {
    resizeMode: 'cover'
  },
  assassin: {
    resizeMode: 'contain',
    position: 'absolute',
    zIndex: Platform.OS === 'ios' ? -1 : null,
    bottom: -20,
    left: -320,
    opacity: 0.78
  },
  buttonsWrapper: {
    backgroundColor: 'transparent',
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
    fontFamily: fonts.headers,
    fontSize: 15,
    fontWeight: 'bold'
  },
  logoWrapper: {
    flex: 1,
    flexDirection: 'row',
    maxWidth: 350
  },
  logo: {
    flex: 1,
    resizeMode: 'contain',
    alignSelf: 'center'
  }
})