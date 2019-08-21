import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image, Dimensions, SafeAreaView, Animated, KeyboardAvoidingView, Keyboard, Alert } from 'react-native'
import axios from 'axios'
import { Button, Icon } from 'react-native-elements'
import { fonts } from '../../utils/styles'
import { Input } from 'react-native-elements'
import { colors } from '../../utils/styles'
import { BASE_URL } from '../../utils/requests'


export default class NewGameScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      codename: '',
      orientation: 'portrait',
      headerPosition: new Animated.Value(150),
      keyboardVisible: false,
      gameId: '',
      codename: '', 
      errors: null
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

    this.slideText()

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.showKeyboard
    )

    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.hideKeyboard
    )
  }

  showKeyboard = () => {
    this.setState({ keyboardVisible: true })
  }

  hideKeyboard = () => {
    this.setState({ keyboardVisible: false })
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  slideText = () => {
    Animated.timing(this.state.headerPosition, {
      toValue: 0,
      duration: 550
    }).start()
  }

  isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
  }

  renderHeader = () => {
    return (
      <View>
        <TouchableOpacity
          style={style(this.state.orientation).headerBack}
          onPress={() => this.props.navigation.goBack()}>
          <Icon
            type={'ionicon'}
            name={'ios-arrow-back'}
            size={36}
            color={'black'}
          />
        </TouchableOpacity>
        <View style={style(this.state.orientation).headerWrapper}>
          <View style={[style(this.state.orientation).headerTextWrapper, { width: this.state.orientation === 'landscape' && this.state.keyboardVisible ? null : '62%' }]}>
            <Animated.Text
              style={{
                fontSize: 22,
                color: 'black',
                fontFamily: fonts.headers,
                left: this.state.headerPosition,
              }}>
              JOIN GAME
            </Animated.Text>
          </View>
        </View>
      </View>
    )
  }

  renderMaleAgent = () => {
    return (
      <Image
        source={require('codenamesReactNative/src/assets/images/MaleAgentSilhouette.png')}
        style={style(this.state.orientation).maleAgent}>
      </Image>
    )
  }

  renderFemaleAgent = () => {
    return (
      <Image
        source={require('codenamesReactNative/src/assets/images/FemaleAgentSilhouette.png')}
        style={style(this.state.orientation).femaleAgent}>
      </Image>
    )
  }

  selectRole = async () => {
    await axios.get(BASE_URL + `local_games/${this.state.gameId}`, {
      params: {
        codename: this.state.codename
      },
      headers: {
        'content-type': 'application/JSON'
      }
    })
      .then((response) => {
        if (response.data && response.data.error) {
          console.log({ errors: response.data.error })
          Alert.alert(
            'Codename incorrect',
            'You missed your target',
            [{ text: 'Try again', onPress: () => console.log('OK Pressed') }]
          )
        } else if (response.data && !response.data.error) {
          this.props.navigation.navigate('RoleSelect', {
            gameId: response.data.game_id,
            codename: response.data.codename
          })
          this.gameInput.clear()
          this.codeInput.clear()
          Keyboard.dismiss()
        } else {
          this.setState({ errors: 'Error: please check your network connection and try again.' })
        }
      })
  }

  renderButtons = () => {
    return (
      <View>
        <Button
          title={'Select Role'}
          onPress={() => this.selectRole()}
          disabled={this.state.codename.length < 1}
          disabledTitleStyle={{ color: 'white', opacity: 0.6 }}
          disabledStyle={{ opacity: 0.6 }}
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

  setGameId = (input) => {
    this.setState({ gameId: input })
  }

  setCodename = (input) => {
    this.setState({ codename: input })
  }

  renderForm = () => {
    return (
      <View>
        <Input
          ref={input => (this.gameInput = input)}
          placeholder='Game ID'
          leftIcon={{ type: 'material-community', name: 'sort-numeric' }}
          inputContainerStyle={style(this.state.orientation).inputContainer}
          inputStyle={style(this.state.orientation).input}
          leftIconContainerStyle={style(this.state.orientation).formIconContainer}
          onChangeText={(i) => {this.setGameId(i)}}
          keyboardType={'numeric'}
        />
        <Input
          ref={input => (this.codeInput = input)}
          placeholder='Codename'
          leftIcon={{ type: 'ionicon', name: 'md-key' }}
          inputContainerStyle={[style(this.state.orientation).inputContainer, { marginTop: this.state.orientation === 'portrait' ? 10 : 6 }]}
          inputStyle={style(this.state.orientation).input}
          onChangeText={(i) => { this.setCodename(i) }}
          maxLength={10}
        />
      </View>
    )
  }

  render() {
    return (
      <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
        <SafeAreaView style={style().backgroundWrappers}>
          {this.renderHeader()}
          <Image
            source={require('codenamesReactNative/src/assets/images/WhiteTexturedBackground.jpg')}
            style={style(this.state.orientation).imageBackground}
          />
          <View style={style().backgroundWrappers}>
            <View style={style(this.state.orientation).screenWrapper}>
              <View style={style(this.state.orientation).elementsWrapper}>
                {this.renderForm()}
                {this.renderButtons()}
              </View>
              {this.renderMaleAgent()}
              {this.renderFemaleAgent()}
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    )
  }
}

const style = (orientation = null) => {
  return (
    StyleSheet.create({
      imageBackground: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: -1
      },
      screenWrapper: {
        flex: 1,
        justifyContent: 'center'
      },
      headerWrapper: {
        flexDirection: 'row',
        marginHorizontal: 15,
        alignSelf: 'flex-end'
      },
      headerTextWrapper: {
        width: (orientation === 'portrait') ? '62%' : '38%',
        borderBottomWidth: 1,
        padding: 5,
        alignItems: 'flex-end'
      },
      headerBack: {
        position: 'absolute',
        width: 55,
        justifyContent: 'center',
        marginLeft: 15,
        marginTop: 2,
        borderRadius: 6,
        opacity: 0.7
      },
      backgroundWrappers: {
        flex: 1,
        backgroundColor: 'transparent'
      },
      elementsWrapper: {
        alignItems: 'center',
        alignSelf: 'center'
      },
      instructionsText: {
        color: 'white',
        fontSize: 12
      },
      buttonContainer: {
        width: 300,
        marginVertical: (orientation === 'portrait') ? 10 : 6,
      },
      button: {
        borderRadius: 8,
        backgroundColor: colors["red-agent-light"],
        opacity: 0.9
      },
      buttonTitle: {
        color: 'white',
        fontFamily: fonts.homeButtons,
        fontSize: 16,
      },
      maleAgent: {
        height: '97%',
        resizeMode: 'contain',
        position: 'absolute',
        zIndex: -1,
        bottom: 4,
        left: -125,
        opacity: 0.75
      },
      femaleAgent: {
        height: '94%',
        resizeMode: 'contain',
        position: 'absolute',
        zIndex: -1,
        bottom: 4,
        left: (orientation === 'portrait') ? 100 : null,
        right: (orientation === 'portrait') ? null : -120,
        opacity: 0.73
      },
      inputContainer: {
        backgroundColor: 'white',
        opacity: 0.93,
        width: 300,
        alignSelf: 'center',
        borderColor: 'transparent',
        borderRadius: 8
      },
      input: {
        marginLeft: 20
      },
      formIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2
      }
    })
  )
}