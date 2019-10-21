import React from 'react'
import { View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Image, Dimensions, SafeAreaView, Animated, KeyboardAvoidingView, Keyboard, Alert, ActivityIndicator, Platform } from 'react-native'
import axios from 'axios'
import { Button, Icon } from 'react-native-elements'
import { fonts } from '../../utils/styles'
import { Input } from 'react-native-elements'
import { colors } from '../../utils/styles'
import { BASE_URL } from '../../utils/requests'


export default class LobbyScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      codename: '',
      orientation: 'portrait',
      headerPosition: new Animated.Value(150),
      keyboardVisible: false,
      gameId: '',
      codename: '',
      loading: false
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
        source={require('RNcodenames0605/src/assets/images/male_agent_silhouette.png')}
        style={style(this.state.orientation).maleAgent}>
      </Image>
    )
  }

  renderFemaleAgent = () => {
    return (
      <Image
        source={require('RNcodenames0605/src/assets/images/female_agent_silhouette.png')}
        style={style(this.state.orientation).femaleAgent}>
      </Image>
    )
  }

  joinGame = async () => {
    await this.setState({ loading: true })
    await Keyboard.dismiss()
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
          this.setState({ loading: false })
          Alert.alert(
            'Codename incorrect',
            'You missed your target',
            [{ text: 'Try again', onPress: () => this.codeInput.focus() }]
          )
        } else if (response.data && !response.data.error) {
          this.props.navigation.navigate('RoleSelect', {
            gameId: response.data.game_id,
            codename: response.data.codename
          })
          this.setState({ 
            loading: false,
            gameId: '',
            codename: ''
          })
          this.gameInput.clear()
          this.codeInput.clear()
        }
      })
      .catch((error) => {
        if (error.response.status === 404) {
          Alert.alert(
            `No game exists with an ID of ${this.state.gameId}`,
            'Please enter another Game ID',
            [{ text: 'Try again', onPress: () => this.gameInput.focus() }]
          )
          this.setState({
            loading: false,
            gameId: ''
          })
          this.gameInput.clear()
        } else {
          this.setState({ loading: false })
          Alert.alert(
            'Network Error',
            'please check your connection and try again',
            [{ text: 'OK', onPress: () => this.gameInput.focus() }]
          )
        }
      })
  }

  renderButtons = () => {
    return (
      <View>
        <Button
          title={'Select Role'}
          onPress={() => this.joinGame()}
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

  renderColorForTheme = () => {
    return (this.props.screenProps.isDarkMode) ? colors.darkGray : null
  }

  renderForm = () => {
    return (
      <View>
        <Input
          ref={input => (this.gameInput = input)}
          placeholder='Game ID'
          placeholderTextColor={this.renderColorForTheme()}
          leftIcon={{ 
            type: 'material-community', 
            name: 'sort-numeric', 
            color: (this.props.screenProps.isDarkMode) ? 'white' : null }}
          inputContainerStyle={style(this.state.orientation, this.props).inputContainer}
          inputStyle={style(this.state.orientation).input}
          leftIconContainerStyle={style(this.state.orientation).formIconContainer}
          onChangeText={(i) => {this.setGameId(i)}}
          keyboardType={'numeric'}
        />
        <Input
          ref={input => (this.codeInput = input)}
          placeholder='Codename'
          placeholderTextColor={this.renderColorForTheme()}
          leftIcon={{ 
            type: 'ionicon', 
            name: 'md-key', 
            color: (this.props.screenProps.isDarkMode) ? 'white' : null }}
          inputContainerStyle={[style(this.state.orientation, this.props).inputContainer, { marginTop: this.state.orientation === 'portrait' ? 10 : 6 }]}
          inputStyle={style(this.state.orientation).input}
          onChangeText={(i) => { this.setCodename(i) }}
          maxLength={10}
        />
      </View>
    )
  }

  renderLoader = () => {
    return (
      <View style={style(this.state.orientation).loader}>
        <ActivityIndicator 
          size="large" 
          color={colors["blue-agent"]} 
          animating={this.state.loading} 
        />
      </View>
    )
  }

  renderAndroid = () => {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={style().backgroundWrappers}>
          {this.renderHeader()}
          <Image
            source={require('RNcodenames0605/src/assets/images/white_textured_background.jpg')}
            style={style(this.state.orientation).imageBackground}
          />
          <KeyboardAvoidingView style={{ flex: 1 }}>
            <View style={style().backgroundWrappers}>
              <View style={style(this.state.orientation).screenWrapper}>
                <View style={style(this.state.orientation).elementsWrapper}>
                  {this.renderForm()}
                  {this.renderButtons()}
                  {this.renderLoader()}
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
          {this.renderMaleAgent()}
          {this.renderFemaleAgent()}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    )
  }

  renderIOS = () => {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
          <SafeAreaView style={style().backgroundWrappers}>
            {this.renderHeader()}
            <Image
              source={require('RNcodenames0605/src/assets/images/white_textured_background.jpg')}
              style={style(this.state.orientation).imageBackground}
            />
            <View style={style().backgroundWrappers}>
              <View style={style(this.state.orientation).screenWrapper}>
                <View style={style(this.state.orientation).elementsWrapper}>
                  {this.renderForm()}
                  {this.renderButtons()}
                  {this.renderLoader()}
                </View>
                {this.renderMaleAgent()}
                {this.renderFemaleAgent()}
              </View>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    )
  }

  render() {
    return Platform.OS === 'ios' ? this.renderIOS() : this.renderAndroid()
  }
}

const style = (orientation = null, props = null) => {
  return (
    StyleSheet.create({
      imageBackground: {
        width: '100%',
        height: '110%',
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
        padding: 4,
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
        marginVertical: (orientation === 'portrait') ? 10 : 6
      },
      button: {
        borderRadius: 8,
        backgroundColor: colors["red-agent-light"],
        opacity: 0.9
      },
      buttonTitle: {
        color: 'white',
        fontFamily: fonts.headers,
        fontSize: 15,
        fontWeight: 'bold'
      },
      maleAgent: {
        height: Platform.OS === 'ios' ? '97%' : '93%',
        resizeMode: 'contain',
        position: 'absolute',
        zIndex: -1,
        bottom: 4,
        left: Platform.OS === 'ios' ? -120 : -105,
        opacity: 0.75
      },
      femaleAgent: {
        height: Platform.OS === 'ios' ? '94%' : '90%',
        resizeMode: 'contain',
        position: 'absolute',
        zIndex: -1,
        bottom: 4,
        left: (orientation === 'portrait') ? 100 : null,
        right: (orientation === 'portrait') ? null : -120,
        opacity: 0.73
      },
      inputContainer: {
        backgroundColor: (props && props.screenProps.isDarkMode) ? 'black' : 'white',
        opacity: (props && props.screenProps.isDarkMode) ? 0.88 : 0.93,
        width: 300,
        alignSelf: 'center',
        borderColor: 'transparent',
        borderRadius: 8
      },
      input: {
        color: (props && props.screenProps.isDarkMode) ? 'white' : null,
        marginLeft: 20
      },
      formIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2
      },
      loader: { 
        margin: 20,
        position: (orientation === 'portrait') ? null : 'absolute'
      }
    })
  )
}