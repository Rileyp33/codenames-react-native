import React from 'react'
import { Animated, View, Image, Dimensions, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native'
import { CheckBox, Icon } from 'react-native-elements'
import { colors, fonts, globalStyles } from '../../utils/styles'
import axios from 'axios'
import { BASE_URL } from '../../utils/requests'
import { ScaledSheet, scale } from 'react-native-size-matters'
import LinearGradient from 'react-native-linear-gradient'
import { CodenamesButton } from '../../components/global/codenamesButton'

export default class RoleSelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      operative: false,
      spymaster: false,
      orientation: 'portrait',
      loading: false
    }

    this.spymasterOpacity = new Animated.Value(0.01)
    this.operativeOpacity = new Animated.Value(0.01)
    this.spymasterBottom = new Animated.Value(-300)
    this.spymasterLeft = new Animated.Value(-125)
    this.maleAgentPosition = new Animated.Value(200)
    this.femaleAgentPosition = new Animated.Value(200)
    this.headerPosition = new Animated.Value(150)
  }

  componentDidMount() {
    const dim = Dimensions.get('screen');
    this.setState({
      orientation: (dim.height >= dim.width) ? 'portrait' : 'landscape'
    })

    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: this.isPortrait() ? 'portrait' : 'landscape',
      })
      this.maleAgentPosition = new Animated.Value(this.isPortrait() ? -90 : 50)
      this.femaleAgentPosition = new Animated.Value(this.isPortrait() ? -90 : 50)
    })

    this.slideText()
  }

  isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
  }

  slideText = () => {
    Animated.timing(this.headerPosition, {
      toValue: 1,
      duration: 550
    }).start()
  }

  fadeOperatives = () => {
    this.spymasterOpacity = new Animated.Value(0.01)
    this.spymasterBottom = new Animated.Value(-300)
    this.spymasterLeft = new Animated.Value(-125)
    Animated.timing(this.operativeOpacity, {
      toValue: 0.45,
      duration: 600
    }).start()
  }

  slideMaleAgent = () => {
    Animated.timing(this.maleAgentPosition, {
      toValue: (this.state.orientation === 'portrait') ? -90 : 50,
      duration: 250,
    }).start()
  }

  slideFemaleAgent = () => {
    Animated.timing(this.femaleAgentPosition, {
      toValue: (this.state.orientation === 'portrait') ? -90 : 50,
      duration: 250
    }).start()
  }

  animateAgents = () => {
    this.fadeOperatives()
    this.slideFemaleAgent()
    this.slideMaleAgent()
  }

  fadeSpymaster = () => {
    this.operativeOpacity = new Animated.Value(0.01)
    this.maleAgentPosition = new Animated.Value(200)
    this.femaleAgentPosition = new Animated.Value(200)
    Animated.parallel([
      Animated.timing(this.spymasterOpacity, {
        toValue: 0.5,
        duration: 600
      }),
      Animated.timing(this.spymasterBottom, {
        toValue: -20,
        duration: 250
      }),
      Animated.timing(this.spymasterLeft, {
        toValue: -260,
        duration: 250
      })
    ]).start()
  }

  renderAgents = () => {
    return (
      <View style={style().characters}>
        <Animated.Image
          source={require('RNcodenames0605/src/assets/images/female_agent_silhouette_white.png')}
          style={{
            height: Dimensions.get("window").height * .88,
            resizeMode: 'contain',
            position: 'absolute',
            zIndex: -1,
            bottom: 1,
            left: this.femaleAgentPosition,
            opacity: this.operativeOpacity
          }}>
        </Animated.Image>
        <Animated.Image
          source={require('RNcodenames0605/src/assets/images/male_agent_silhouette_white.png')}
          style={{
            height: Dimensions.get("window").height * .88,
            resizeMode: 'contain',
            position: 'absolute',
            zIndex: -1,
            bottom: 1,
            right: this.maleAgentPosition,
            opacity: this.operativeOpacity
          }}>
        </Animated.Image>
      </View>
    )
  }

  renderAssassin = () => {
    return (
      <Animated.Image
        source={require('RNcodenames0605/src/assets/images/assassin_white.png')}
        style={{
          resizeMode: 'contain',
          maxHeight: (this.state.orientation === 'portrait') ? '57%' : '72%',
          left: (this.state.orientation === 'portrait') ? null : this.spymasterLeft,
          position: 'absolute',
          zIndex: -1,
          bottom: this.spymasterBottom,
          opacity: this.spymasterOpacity,
        }}>
      </Animated.Image>
    )
  }

  joinGame = async () => {
    await this.setState({ loading: true })
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
          this.setState({ loading: false })
          this.setState({ errors: response.data.error })
        } else if (response.data && !response.data.error) {
          this.setState({ 
            loading: false
          })
          this.props.navigation.navigate('Game', {
            gameId: response.data.game_id,
            codename: response.data.codename,
            role: (this.state.operative) ? "operative" : "spymaster"
          })
          this.setState({
            operative: false,
            spymaster: false
          })
        } else {
          this.setState({ loading: false })
          this.setState({ errors: 'Error: please check your network connection and try again.' })
        }
      })
  }

  setOperative = () => {
    this.animateAgents()
    this.setState({ 
      operative: true,
      spymaster: false
     })
  }

  setSpymaster = () => {
    this.fadeSpymaster()
    this.setState({
      operative: false,
      spymaster: true
    })
  }

  roleSelected = () => {
    if (this.state.operative || this.state.spymaster) {
      return true
    } else { 
      return false 
    }
  }

  renderCheckboxes = () => {
    return (
      <View style={[style(this.state.orientation).selectionContainer, globalStyles.shadow]}>
        <LinearGradient
          colors={[colors.white, colors.lightGray]}
          style={style(this.state.orientation).checkboxContainer}
        >
          <CheckBox
            title='Field Operative'
            checkedIcon='target'
            iconType='material-community'
            size={scale(30)}
            textStyle={style(this.state.orientation).checkboxText}
            checkedColor={colors["red-agent"]}
            uncheckedIcon='checkbox-blank-circle-outline'
            checked={this.state.operative}
            containerStyle={style(this.state.orientation).checkbox}
            onPress={() => this.setOperative()}
          />
        </LinearGradient>
        <LinearGradient
          colors={[colors.white, colors.lightGray]}
          style={[style(this.state.orientation).checkboxContainer, globalStyles.shadow]}
        >
          <CheckBox
            title='Spymaster'
            checkedIcon='target'
            iconType='material-community'
            size={scale(30)}
            textStyle={style(this.state.orientation).checkboxText}
            checkedColor={colors["red-agent"]}
            uncheckedIcon='checkbox-blank-circle-outline'
            checked={this.state.spymaster}
            containerStyle={style(this.state.orientation).checkbox}
            onPress={() => this.setSpymaster()}
          />
        </LinearGradient>
      </View>
    )
  }

  renderButton = () => {
    // return (
    //   <View style={style(this.state.orientation).buttonsWrapper}>
    //     <Button
    //       disabled={!this.roleSelected()}
    //       disabledTitleStyle={{color: 'white', opacity: 0.6}}
    //       disabledStyle={{opacity: 0.6}}
    //       title={'Join Game'}
    //       onPress={() => this.joinGame()}
    //       type={'clear'}
    //       containerStyle={style(this.state.orientation).buttonContainer}
    //       buttonStyle={style(this.state.orientation).button}
    //       titleStyle={style(this.state.orientation).buttonTitle}
    //       raised={true}
    //       icon={{
    //         type: 'ionicon',
    //         name: 'ios-arrow-forward',
    //         size: 30,
    //         color: 'white',
    //         paddingRight: 20
    //       }}
    //     />
    //   </View>
    // )
    const buttonProps = {
      value: 'Join Game',
        icon: {
          type: 'ionicon',
          name: 'ios-arrow-forward',
          size: scale(30),
          color: colors.white
        },
        onPress: this.joinGame,
        gradient: [
          colors['red-agent-light'],
          colors['red-agent']
        ],
        textColor: colors.white,
        disabled: !this.roleSelected()
    }
    return (
      <View style={{width: 300}}>
        <CodenamesButton
          {...buttonProps}
        />
      </View>
    )
  }

  renderHeaderText = () => {
    return (
      <View style={{alignSelf: 'flex-end'}}>
        <View style={style(this.state.orientation).headerWrapper}>
          <View style={style(this.state.orientation).headerTextWrapper}>
            <Animated.Text
              style={{
                fontSize: 22,
                color: 'white',
                fontFamily: fonts.headers,
                left: this.headerPosition,
              }}>
              SELECT ROLE
            </Animated.Text>
          </View>
        </View>
      </View>
    )
  }

  renderBackButton = () => {
    return (
      <TouchableOpacity
        style={style(this.state.orientation).headerBack}
        onPress={() => this.props.navigation.goBack()}>
        <Icon
          type={'ionicon'}
          name={'ios-arrow-back'}
          size={36}
          color={'white'}
        />
      </TouchableOpacity>
    )
  }

  renderHeader = () => {
    return (
      <View style={style().topWrapper}>
        {this.renderHeaderText()}
        {this.renderBackButton()}
      </View>
    )
  }

  renderLoader = () => {
    return (
      <View style={style().loader}>
        <ActivityIndicator
          size="large"
          color={'white'}
          animating={this.state.loading}
        />
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView style={style(this.state.orientation).safeArea}>
        <StatusBar barStyle="light-content" />
        {this.renderHeader()}
        <Image
          source={require('RNcodenames0605/src/assets/images/black_textured_background.jpg')}
          style={style(this.state.orientation).imageBackgroundFull}>
        </Image>
        <View style={style(this.state.orientation).screenContainer}>
          <View style={style(this.state.orientation).elementsWrapper}>
            {this.renderCheckboxes()}
            {this.renderButton()}
            {this.renderLoader()}
          </View>
        </View>
        {
          (this.state.operative) ? this.renderAgents()
          : (this.state.spymaster) ? this.renderAssassin()
          : null
        }
      </SafeAreaView>
    )
  }
}

const style = (orientation) => {
  return ScaledSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: 'black',
      alignItems: 'center',
      overflow: 'hidden'
    },  
    topWrapper: { 
      width: '100%' 
    },
    imageBackgroundFull: {
      height: Dimensions.get("window").height,
      minWidth: Dimensions.get("window").width,
      resizeMode: orientation === 'portrait' ? 'contain' : 'cover',
      alignSelf: 'center',
      position: 'absolute',
      zIndex: -10
    },
    screenContainer: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    characters: {
      zIndex: -1
    },
    buttonsWrapper: {
      alignItems: 'center',
      zIndex: 100
    },
    buttonContainer: {
      width: 300
    },
    button: {
      borderRadius: '8@s',
      backgroundColor: colors["red-agent-light"],
      opacity: 0.9
    },
    buttonTitle: {
      color: 'white',
      fontWeight: 'bold',
      fontFamily: fonts.headers,
      fontSize: '15@s',
    },
    checkboxContainer: {
      width: 300,
      height: '50@s',
      marginBottom: '12@s',
      marginTop: 0,
      borderRadius: '6@s',
      justifyContent: 'center'
    },
    checkbox: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      padding: 0
    },
    checkboxText: {
      fontSize: '20@s',
      fontFamily: fonts.main,
      color: 'black',
      marginLeft: '25@s'
    },
    selectionContainer: {
      marginBottom: '4@s',
      borderBottomColor: 'white',
      borderBottomWidth: 1,
      width: 300,
      alignItems: 'center'
    },
    headerWrapper: {
      flexDirection: 'row',
      marginHorizontal: '15@s',
      alignSelf: 'flex-end'
    },
    headerTextWrapper: {
      width: '62%',
      borderBottomWidth: 1,
      borderBottomColor: 'white',
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
    loader: {
      margin: '20@s'
    }
  })
}