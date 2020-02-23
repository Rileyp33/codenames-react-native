import React from 'react'
import { View, TouchableOpacity, Image, Dimensions, SafeAreaView, Animated, KeyboardAvoidingView, Keyboard, ActivityIndicator, TouchableWithoutFeedback, Platform } from 'react-native'
import { Icon } from 'react-native-elements'
import { fonts } from '../../utils/styles'
import { Input } from 'react-native-elements'
import { apiCall } from '../../utils/requests'
import { colors, globalStyles } from '../../utils/styles'
import { GlobalText } from '../../components/global/globalText'
import { ScaledSheet } from 'react-native-size-matters'
import { CodenamesButton } from '../../components/global/codenamesButton'


export default class NewGameScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      codename: '', 
      orientation: 'portrait',
      headerPosition: new Animated.Value(150),
      loading: false,
      keyboardVisible: false
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

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );

    this.slideText()
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  _keyboardDidShow = () => (
    this.state && this.setState({ keyboardVisible: true })
  )

  _keyboardDidHide = () => (
    this.state && this.setState({ keyboardVisible: false })
  )

  componentDidUpdate() { console.log(this.state.keyboardVisible) }

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
                NEW GAME
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

  createGame = async () => {
    await this.setState({ loading: true })
    await Keyboard.dismiss()
    let body = JSON.stringify({
      role: 'operative',
      codename: this.state.codename.trim()
    })
    let creationResponse = await apiCall(body, 'post', 'local_games')
    let navigate = await this.props.navigation.navigate('RoleSelect', { gameId: creationResponse.data.game_id, codename: creationResponse.data.codename })
    this.setState({ 
      loading: false,
      codename: ''
    })
    this.codename.clear()
  }

  renderButtons = () => {
    const buttonProps = {
      value: 'Create Game',
        icon: {
          type: 'ionicon',
          name: 'ios-arrow-forward',
          size: 30,
          color: colors.white
        },
        onPress: this.createGame,
        gradient: [
          colors['red-agent-light'],
          colors['red-agent']
        ],
        textColor: colors.white,
        disabled: this.state.codename.length === 0
    }
    return (
      <View style={{width: 300}}>
        <CodenamesButton
          {...buttonProps}
        />
      </View>
    )
  }

  setCodename = (input) => {
    this.setState({ codename: input })
  }

  renderColorForTheme = () => {
    return (this.props.screenProps.isDarkMode) ? colors.darkGray : null
  }

  renderForm = () => {
    return (
      <View style={globalStyles.shadow}>
        <Input
          ref={input => (this.codename = input)}
          placeholder='Codename'
          placeholderTextColor={this.renderColorForTheme()}
          leftIcon={{ 
            type: 'ionicon', 
            name: 'md-key', 
            color: (this.props.screenProps.isDarkMode) ? 'white' : null }}
          inputContainerStyle={[style(this.state.orientation, this.props).inputContainer, { borderRadius: this.state.keyboardVisible && this.state.orientation === 'landscape' ? 8 : null }]}
          inputStyle={style(this.state.orientation).input}
          onChangeText={(i) => { this.setCodename(i) }}
          maxLength={10}
        />
        <View style={[
            style(this.state.orientation).instructions,
            {
              display: this.state.keyboardVisible && this.state.orientation === 'landscape'
                ? 'none'
                : 'flex' }]}>
          <GlobalText
            value={'Create a unique codename for your game. Your party will enter this to join.'}
            style={style(this.state.orientation).instructionsText}
          />
        </View>
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
          <KeyboardAvoidingView behavior={'height'} style={{ flex: 1 }}>
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
    ScaledSheet.create({
      imageBackground: {
        width: '100%',
        height: '120%',
        position: 'absolute',
        zIndex: -1
      },
      screenWrapper: {
        flex: 1,
        justifyContent:'center'
      },
      headerWrapper: {
        flexDirection: 'row',
        marginHorizontal: '15@s',
        alignSelf: 'flex-end'
      },  
      headerTextWrapper: {
        width: (orientation === 'portrait') ? '62%' : '38%',
        borderBottomWidth: 1,
        padding: '5@s',
        alignItems: 'flex-end'
      },
      headerBack: {
        position: 'absolute',
        width: '40@s',
        justifyContent: 'center',
        marginLeft: '15@s',
        marginTop: '2@s',
        borderRadius: '6@s',
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
      instructions: {
        paddingHorizontal: '12@s',
        padding: '12@s',
        backgroundColor: colors.darkGray,
        width: 300,
        alignSelf: 'center',
        borderBottomLeftRadius: '8@s',
        borderBottomRightRadius: '8@s',
        top: -2
      },
      instructionsText: {
        color: 'white',
        fontSize: '14@s'
      },
      buttonContainer: {
        width: 300,
        marginTop: (orientation === 'portrait') ? '12@s' : '6@s',
      },
      button: {
        borderRadius: '8@s',
        backgroundColor: colors["red-agent-light"]
      },
      buttonTitle: {
        color: 'white',
        fontFamily: fonts.headers,
        fontSize: '15@s',
        fontWeight: 'bold'
      },
      maleAgent: {
        height: Platform.OS === 'ios'? '97%' : '93%',
        resizeMode: 'contain',
        position: 'absolute',
        zIndex: -1,
        bottom: 4,
        left: -125,
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
        width: 300,
        height: '45@s',
        alignSelf: 'center',
        borderColor: 'transparent',
        borderTopLeftRadius: '8@s',
        borderTopRightRadius: '8@s'
      },
      input: {
        color: (props && props.screenProps.isDarkMode) ? 'white' : null,
        marginLeft: '20@s',
        fontSize: '18@s'
      },
      formIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '2@s'
      },
      loader: {
        margin: '20@s',
        position: (orientation === 'portrait') ? null : 'absolute'
      }
    })
  )
} 