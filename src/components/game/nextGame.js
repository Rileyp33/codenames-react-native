import React from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { Button } from 'react-native-elements'
import { colors, fonts } from '../../utils/styles'

export default class NextGame extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newPosition: new Animated.Value(-80),
      joinPosition: new Animated.Value(-80)
    }
  }

  componentDidMount() {
    setTimeout(() => {
      Animated.timing(this.state.newPosition, {
        toValue: 0,
        duration: 250
      }).start() 
    }, 1000);
    setTimeout(() => {
      Animated.timing(this.state.joinPosition, {
        toValue: 0,
        duration: 230
      }).start() 
    }, 1150);
  }

  navNewGame = () => {
    this.props.navigation.navigate('NewGame')
  }

  navLobby = () => {
    this.props.navigation.navigate('Lobby')
  }

  render() {
    return (
      <View use style={style(this.props).buttonsWrapper}>
        <Animated.View use style={{
          bottom: this.state.newPosition,
          flex: 1
        }}>
          <Button
            title={(this.props.orientation === 'portrait') ? 'New Game' : 'New'}
            onPress={() => this.navNewGame()}
            type={'solid'}
            containerStyle={style(this.props).buttonContainer}
            buttonStyle={style(this.props).button}
            titleStyle={style(this.props).buttonTitle}
            raised={true}
            icon={{
              type: 'material-community',
              name: 'cards-playing-outline',
              size: (this.props.orientation === 'portrait') ? 24 : 20,
              color: colors["red-agent"],
              paddingRight: (this.props.orientation === 'portrait') ? 8 : 0,
              marginLeft: (this.props.orientation === 'portrait') ? -6 : 0,
              bottom: -1
            }}
          />
        </Animated.View>
        <Animated.View use style={{
          bottom: this.state.joinPosition,
          flex: 1
        }}>
          <Button
            title={(this.props.orientation === 'portrait') ? 'Join Game' : 'Join'}
            onPress={() => this.navLobby()}
            type={'solid'}
            containerStyle={style(this.props).buttonContainer}
            buttonStyle={style(this.props).button}
            titleStyle={style(this.props).buttonTitle}
            raised={true}
            icon={{
              type: 'antdesign',
              name: 'addusergroup',
              size: (this.props.orientation === 'portrait') ? 24 : 20,
              color: colors["blue-agent"],
              paddingRight: (this.props.orientation === 'portrait') ? 8 : 0,
              marginLeft: (this.props.orientation === 'portrait') ? -6 : 0,
              bottom: -1
            }}
          />
        </Animated.View>
      </View>
    )
  }
}

const style = (props = null) => {
  let orientation, isDarkMode
  if (props) {
    orientation = props.orientation
    isDarkMode = props.isDarkMode
  }
  console.log(isDarkMode)
  return StyleSheet.create({
    buttonsWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: (orientation === 'portrait') ? 10 : 3, 
      marginLeft: (orientation === 'portrait') ? 0 : 9.5,
    },
    buttonContainer: {
      marginTop: 10,
      marginHorizontal: 2.5
    },
    button: {
      borderRadius: 6,
      backgroundColor: isDarkMode
        ? colors.lightGray
        : colors.darkGray,
    },
    buttonTitle: {
      color: isDarkMode
        ? colors.darkGray
        : colors.white,
      fontFamily: fonts.main,
      fontSize: (orientation === 'portrait') ? 15 : 12,
      fontFamily: fonts.main,
      fontWeight: 'bold',
      marginLeft: (orientation === 'portrait') ? -6 : 0
    }
  })
}