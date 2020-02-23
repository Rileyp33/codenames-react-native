import React from 'react'
import { View, StyleSheet, ImageBackground, Image, Platform } from 'react-native'
import { Button } from 'react-native-elements'
import { CodenamesButton } from '../../components/global/codenamesButton'
import { fonts, colors } from '../../utils/styles'

export default class HomeScreen extends React.Component{
  constructor(props) {
    super(props)
    this.buttonData = [
      {
        value: 'New Game',
        icon: {
          type: 'material-community',
          name: 'cards-playing-outline',
          size: 30,
          color: colors["red-agent"]
        },
        onPress: this.newGame
      },
      {
        value: 'Join Game',
        icon: {
          type: 'antdesign',
          name: 'addusergroup',
          size: 30,
          color: colors["blue-agent"]
        },
        onPress: this.joinGame
      },
      {
        value: 'Rules',
        icon: {
          type: 'material-community',
          name: 'sign-text',
          size: 30,
          color: colors.darkGray
        },
        onPress: this.showRules
      },
    ]
  }

  renderLogo = () => {
    return (
      <View style={style.logoWrapper}>
        <Image
          source={require('RNcodenames0605/src/assets/images/codenames_logo_white.png')}
          style={style.logo}>
        </Image>
      </View>
    )
  }

  renderButtons = () => {
    return this.buttonData.map((b) => (
      <CodenamesButton
        {...b}
      />
    ))
  }

  renderAssassin = () => {
    return (
      <Image
        source={require('RNcodenames0605/src/assets/images/Assassin.png')}
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
        source={require('RNcodenames0605/src/assets/images/orange_background.jpg')}
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
    height: '100%',
    overflow: 'hidden'
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