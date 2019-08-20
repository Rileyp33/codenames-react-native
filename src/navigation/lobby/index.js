import React from 'react'
import { View, StyleSheet, ImageBackground, Image, Dimensions, Alert } from 'react-native'
import axios from 'axios'
import { Button } from 'react-native-elements'
import { fonts } from '../../utils/styles'
import { Input } from 'react-native-elements'
import { BASE_URL } from '../../utils/requests'
import BackButton from '../../components/backButton'

export default class LobbyScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gameId: '',
      codename: '', 
      errors: null,
      orientation: 'portrait'
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
      if(response.data && response.data.error) {
        console.log({ errors: response.data.error })
        Alert.alert(
          'Codename denied',
          'You killed a civilian',
          [ { text: 'Try again', onPress: () => console.log('OK Pressed') }]
        )
      } else if (response.data && !response.data.error) {
          this.props.navigation.navigate('RoleSelect', {
            gameId: response.data.game_id,
            codename: response.data.codename
          })
      } else {
        this.setState({ errors: 'Error: please check your network connection and try again.' })
      }
    })
  }

  renderButtons = () => {
    return (
      <View style={style(this.state.orientation).buttonsWrapper}>
        <Button
          title={'Select Role'}
          onPress={() => this.selectRole()}
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
          inputContainerStyle={style(this.state.orientation).inputContainer}
          inputStyle={style(this.state.orientation).input}
          onChangeText={(i) => { this.setCodename(i) }}
          maxLength={10}
        />
      </View>
    )
  }

  renderBack = () => {
    return (
      <BackButton
        orientation={this.state.orientation}
        navigation={this.props.navigation}
      />
    )
  }

  render() {
    return (
      <ImageBackground
        source={require('codenamesReactNative/src/assets/images/WhiteTexturedBackground.jpg')}
        style={style(this.state.orientation).imageBackgroundFull}
        imageStyle={style(this.state.orientation).imageStyleFull}>
          <View style={style(this.state.orientation).screenWrapper}>
            <View style={style(this.state.orientation).elementsWrapper}>
              {this.renderForm()}
              {this.renderButtons()}
            </View>
            {this.renderMaleAgent()}
            {this.renderFemaleAgent()}
            {this.renderBack()}
          </View>
      </ImageBackground>
    )
  }
}

const style = (orientation = null) => {
  return (
    StyleSheet.create({
      imageBackgroundFull: {
        width: '100%',
        height: '100%',
      },
      imageStyleFull: {
        resizeMode: 'cover',
      },
      screenWrapper: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
      },
      elementsWrapper: {
        marginTop: (orientation === 'portrait') ? 140 : 20
      },
      buttonsWrapper: {
        alignItems: 'center'
      },
      buttonContainer: {
        width: 300
      },
      button: {
        borderRadius: 8,
        backgroundColor: 'black',
        opacity: 0.9
      },
      buttonTitle: {
        color: 'white',
        fontFamily: fonts.homeButtons,
        fontSize: 16,
      },
      maleAgent: {
        height: '98%',
        resizeMode: 'contain',
        position: 'absolute',
        zIndex: -1,
        bottom: 5,
        left: -130,
        opacity: 0.75
      },
      femaleAgent: {
        height: '95%',
        resizeMode: 'contain',
        position: 'absolute',
        zIndex: -1,
        bottom: 5,
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
        borderRadius: 8,
        marginBottom: (orientation === 'portrait') ? 12 : 6
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