import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image, Dimensions, SafeAreaView, Animated } from 'react-native'
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
      headerPosition: new Animated.Value(150)
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
      duration: 500
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
          />
        </TouchableOpacity>
        <View style={style(this.state.orientation).headerWrapper}>
          <View style={style(this.state.orientation).headerTextWrapper}>
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

  createGame = async () => {
    let body = JSON.stringify({
      role: 'operative',
      codename: this.state.codename
    })
    let creationResponse = await apiCall(body, 'post', 'local_games')
    let navigate = await this.props.navigation.navigate('RoleSelect', { gameId: creationResponse.data.game_id, codename: creationResponse.data.codename })
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
          inputContainerStyle={style(this.state.orientation).inputContainer}
          inputStyle={style(this.state.orientation).input}
          onChangeText={(i) => { this.setCodename(i) }}
          maxLength={10}
        />
        <View style={style(this.state.orientation).instructions}>
          <GlobalText
            value={'Create a unique codename for your game. Your party will enter this to join.'}
            style={style(this.state.orientation).instructionsText}
          />
        </View>
      </View>
    )
  }

  render() {
    return (
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
        flex: 1
      },
      headerWrapper: {
        flexDirection: 'row',
        marginHorizontal: 15,
        alignSelf: 'flex-end'
      },  
      headerTextWrapper: {
        width: (orientation === 'portrait') ? '62%' : '100%',
        borderBottomWidth: 1,
        padding: 5,
        alignItems: 'flex-end'
      },  
      header: {
        fontSize: 22,
        color: 'black',
        fontFamily: fonts.headers
      },
      headerBack: {
        position: 'absolute',
        width: 55,
        justifyContent: 'center'
      },
      backgroundWrappers: {
        flex: 1,
        backgroundColor: 'transparent'
      },
      elementsWrapper: {
        marginTop: (orientation === 'portrait') ? 140 : 15,
        alignItems: 'center'
      },
      instructions: {
        paddingHorizontal: 12,
        marginBottom: (orientation === 'portrait') ? 12 : 6,
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
        width: 300
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
      }
    })
  )
} 