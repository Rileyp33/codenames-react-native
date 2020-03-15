import React from 'react'
import { View, StyleSheet, ScrollView, Image, ImageBackground, Dimensions } from 'react-native'
import { Button } from 'react-native-elements'

export default class RulesScren extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 0,
      width: 0,
      orientation: 'portrait'
    }

    this.device_width = Dimensions.get('window').width;
  }

  componentDidMount(){
    let width = Dimensions.get('window').width
    this.setState({ width: width })
    let ratio = width / 1749
    let height = 12405 * ratio
    this.setState({ height: height })

    const dim = Dimensions.get('screen');
    this.setState({
      orientation: (dim.height >= dim.width) ? 'portrait' : 'landscape'
    })

    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: this.isPortrait() ? 'portrait' : 'landscape'
      })
      let width = Dimensions.get('window').width
      this.setState({ width: width })
      let ratio = width / 1749
      let height = 12405 * ratio
      this.setState({ height: height })
    })
  }
  
  isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
  };

  renderBack = () => {
    return (
      <View style={style().buttonsWrapper}>
        <Button
          onPress={() => this.props.navigation.goBack()}
          type={'clear'}
          containerStyle={style(this.state.orientation).buttonContainer}
          buttonStyle={style().button}
          titleStyle={style().buttonTitle}
          raised={true}
          icon={{
            type: 'ionicon',
            name: 'ios-arrow-back',
            size: 40,
            color: 'white'
          }}
        />
      </View>
    )
  }

  render() {
    return (
      <View style={{backgroundColor: 'black'}}>
        {this.renderBack()}
        <ScrollView maximumZoomScale={2}>
          <Image
            source={{ uri: 'codenames_rules' }}
            style={{
              width: this.state.width,
              height: this.state.height,
              resizeMode: 'contain'
            }}
          />
        </ScrollView>
      </View>
    )
  }
}

const style = (orientation = null) => {
  return StyleSheet.create({
    imageStyle: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      resizeMode: 'contain'
    },
    buttonsWrapper: {
      zIndex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute'
    },
    buttonContainer: {
      width: 55,
      margin: (orientation === 'portrait') ? 25 : 12,
      marginLeft: 10
    },
    button: {
      borderRadius: 8,
      backgroundColor: 'black',
      opacity: 0.8
    }
  })
}