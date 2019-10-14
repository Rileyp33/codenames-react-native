import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image, Dimensions, SafeAreaView, Animated, KeyboardAvoidingView, Keyboard, ActivityIndicator, TouchableWithoutFeedback, Platform } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import { fonts } from '../../utils/styles'
import { Input } from 'react-native-elements'
import { apiCall } from '../../utils/requests'
import { colors } from '../../utils/styles'
import { GlobalText } from '../../components/globalText'


export default class NewGameScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      codename: '', 
      orientation: 'portrait',
      headerPosition: new Animated.Value(150),
      keyboardVisible: false,
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
      codename: this.state.codename
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
    return (
      <View>
        <Button
          title={'Create Game'}
          onPress={() => this.createGame()}
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

  setCodename = (input) => {
    this.setState({ codename: input })
  }

  renderForm = () => {
    return (
      <View>
        <Input
          ref={input => (this.codename = input)}
          placeholder='Codename'
          leftIcon={{ type: 'ionicon', name: 'md-key' }}
          inputContainerStyle={[style(this.state.orientation).inputContainer, { borderRadius: this.state.keyboardVisible && this.state.orientation === 'landscape' ? 8 : null }]}
          inputStyle={style(this.state.orientation).input}
          onChangeText={(i) => { this.setCodename(i) }}
          maxLength={10}
        />
        <View style={
          [style(this.state.orientation).instructions, { display: this.state.keyboardVisible && this.state.orientation === 'landscape' ?  'none' : null }]}>
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

const style = (orientation = null) => {
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
        justifyContent:'center'
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
      instructions: {
        paddingHorizontal: 12,
        padding: 12,
        backgroundColor: colors.darkGray,
        width: 300,
        alignSelf: 'center',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        opacity: 0.93,
      },
      instructionsText: {
        color: 'white',
        fontSize: 12
      },
      buttonContainer: {
        width: 300,
        marginTop: (orientation === 'portrait') ? 12 : 6,
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
        backgroundColor: 'white',
        opacity: 0.93,
        width: 300,
        alignSelf: 'center',
        borderColor: 'transparent',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
      },
      input: {
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