import React from 'react';
import { Animated, View, ImageBackground, Image, StyleSheet, Dimensions } from 'react-native';
import { CheckBox, Button } from 'react-native-elements'
import { colors, fonts } from '../../utils/styles'
import axios from 'axios'
import { BASE_URL } from '../../utils/requests'

export default class RoleSelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      spymasterOpacity: new Animated.Value(0),
      operativeOpacity: new Animated.Value(0),
      operative: true,
      spymaster: false,
      orientation: 'portrait',
    }
  }

  componentDidMount() {
    const dim = Dimensions.get('screen');
    this.setState({
      orientation: (dim.height >= dim.width) ? 'portrait' : 'landscape'
    })

    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: this.isPortrait() ? 'portrait' : 'landscape'
      })
    })
  }

  isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
  };

  joinGame = async () => {
    await axios.get(BASE_URL + `local_games/${this.props.navigation.getParam('gameId')}`, {
      params: {
        codename: this.props.navigation.getParam('codename')
      },
      headers: {
        'content-type': 'application/JSON'
      }
    })
      .then((response) => {
        if (response.data && response.data.error) {
          this.setState({ errors: response.data.error })
        } else if (response.data && !response.data.error) {
          this.props.navigation.navigate('Game', {
            gameId: response.data.game_id,
            codename: response.data.codename,
            role: (this.state.operative) ? "operative" : "spymaster"
          })
        } else {
          this.setState({ errors: 'Error: please check your network connection and try again.' })
        }
      })
  }

  renderAgents = () => {
    return (
      <Animated.View style={style().characters}>
        <Image
          source={require('codenamesReactNative/src/assets/images/FemaleAgentSilhouetteWhite.png')}
          style={style(this.state.orientation).femaleAgent}>
        </Image>
        <Image
          source={require('codenamesReactNative/src/assets/images/MaleAgentSilhouetteWhite.png')}
          style={style(this.state.orientation).maleAgent}>
        </Image>
      </Animated.View>
    )
  }

  renderAssassin = () => {
    return (
      <Image
        source={require('codenamesReactNative/src/assets/images/AssassinWhite.png')}
        style={style().assassin}>
      </Image>
    )
  }

  setOperative = () => {
    this.setState({ 
      operative: true,
      spymaster: false
     })
  }

  setSpymaster = () => {
    this.setState({
      operative: false,
      spymaster: true
    })
  }

  renderCheckboxes = () => {
    return (
      <View style={style(this.state.orientation).selectionContainer}>
        <CheckBox
          title='Field Operative'
          checkedIcon='target'
          iconType='material-community'
          textStyle={style(this.state.orientation).checkboxText}
          checkedColor={colors["red-agent"]}
          uncheckedIcon='checkbox-blank-circle-outline'
          checked={this.state.operative}
          containerStyle={style(this.state.orientation).checkboxContainer}
          onPress={() => this.setOperative()}
        />
        <CheckBox
          title='Sypmaster'
          checkedIcon='target'
          iconType='material-community'
          textStyle={style(this.state.orientation).checkboxText}
          checkedColor={colors["red-agent"]}
          uncheckedIcon='checkbox-blank-circle-outline'
          checked={this.state.spymaster}
          containerStyle={style(this.state.orientation).checkboxContainer}
          onPress={() => this.setSpymaster()}
        />
      </View>
    )
  }

  renderButton = () => {
    return (
      <View style={style(this.state.orientation).buttonsWrapper}>
        <Button
          title={'Join Game'}
          onPress={() => this.joinGame()}
          type={'clear'}
          containerStyle={style(this.state.orientation).buttonContainer}
          buttonStyle={style(this.state.orientation).button}
          titleStyle={style(this.state.orientation).buttonTitle}
          raised={true}
          icon={{
            type: 'ionicon',
            name: 'ios-arrow-forward',
            size: 30,
            color: 'white',
            paddingRight: 20
          }}
        />
      </View>
    )
  }

  render() {
    return (
      <ImageBackground
        source={require('codenamesReactNative/src/assets/images/BlackTexturedBackground.jpg')}
        style={style(this.state.orientation).imageBackgroundFull}
        imageStyle={style().imageStyleFull}>
        <View style={style(this.state.orientation).screenContainer}>
          {(this.state.operative) ? this.renderAgents() : this.renderAssassin()}
          <View style={style(this.state.orientation).elementsWrapper}>
            {this.renderCheckboxes()}
            {this.renderButton()}
          </View>
        </View>
      </ImageBackground>
    )
  }
}

const style = (orientation, selection) => {
  return StyleSheet.create({
    imageBackgroundFull: {
      width: '100%',
      height: '100%',
      alignSelf: 'center'
    },
    imageStyleFull: {
      resizeMode: 'cover'
    },
    screenContainer: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    elementsWrapper: {
      top: (orientation === 'portrait') ? 140 : 20
    },  
    characters: {
      zIndex: -1
    },
    maleAgent: {
      height: Dimensions.get("window").height * .95,
      resizeMode: 'contain',
      position: 'absolute',
      zIndex: -1,
      top: 10,
      right: (orientation === 'portrait') ? -90 : 50,
      opacity: 0.35
    },
    femaleAgent: {
      height: Dimensions.get("window").height * .95,
      resizeMode: 'contain',
      position: 'absolute',
      zIndex: -1,
      top: 10,
      left: (orientation === 'portrait') ? -90 : 50,
      opacity: 0.35
    },
    assassin: {
      resizeMode: 'contain',
      position: 'absolute',
      zIndex: -1,
      bottom: -20,
      opacity: 0.3
    },
    buttonsWrapper: {
      alignItems: 'center',
      zIndex: 100
    },
    buttonContainer: {
      width: 300
    },
    button: {
      borderRadius: 8,
      backgroundColor: colors["red-agent-light"],
      opacity: 0.8
    },
    buttonTitle: {
      color: 'white',
      fontWeight: 'bold',
      fontFamily: fonts.homeButtons,
      fontSize: 16,
    },
    checkboxContainer: {
      width: 300,
      marginBottom: 12,
      marginTop: 0,
      opacity: 0.85,
      borderRadius: 6
    },
    checkboxText: {
      fontSize: 18,
      fontFamily: fonts.homeButtons,
      color: 'black',
      marginLeft: 25
    },
    selectionContainer: {
      marginBottom: 12,
      borderBottomColor: 'white',
      borderBottomWidth: 1,
      width: 300,
      alignItems: 'center'
    }
  })
}