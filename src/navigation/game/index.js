import React from 'react'
import ActionCable from 'react-native-actioncable'
import { View, SafeAreaView, Image, StyleSheet, Dimensions, ImageBackground, Alert } from 'react-native'
import { Card } from '../../components/game/card'
import { Result } from '../../components/game/result'
import { GameData } from '../../components/game/gameData'
import { GameboardButtons } from '../../components/game/gameboardButtons'
import { Scoreboard } from '../../components/game/scoreboard'
import { BASE_URL } from '../../utils/requests'
import { colors, fonts } from '../../utils/styles'
import axios from 'axios'

export default class GameScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      role: this.props.navigation.getParam('role'),
      cells: null,
      red_score: 0,
      red_total: 0,
      blue_score: 0,
      blue_total: 0,
      assassin: 0,
      result: null,
      timer: false,
      orientation: 'portrait'
    }

    this.gameId = this.props.navigation.getParam('gameId')
    this.codename = this.props.navigation.getParam('codename')

    this.positions = [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24]
    ]

    this.cable = ActionCable.createConsumer('wss://codenames-api-rp.herokuapp.com/cable')
  }

  componentDidMount() {
    this.getGame()

    const dim = Dimensions.get('screen');
    this.setState({ 
      orientation: (dim.height >= dim.width) ? 'portrait' : 'landscape' 
    })

    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: this.isPortrait() ? 'portrait' : 'landscape'
      })
    })

    this.gameChannel = this.cable.subscriptions.create(
      {
        channel: 'GameChannel', 
        game_id: this.gameId
      },
      {
        connected: () => console.log("GameChannel connected"),
        disconnected: () => console.log("GameChannel disconnected"),
        received: data => {
          this.handleDataReceipt(data)
        }
      }
    )

    this.timerChannel = this.cable.subscriptions.create(
      {
        channel: 'TimerChannel',
        timer_id: this.gameId
      },
      {
        connected: () => console.log("GameChannel connected"),
        disconnected: () => console.log("GameChannel disconnected"),
        received: data => {
          console.log('Timer Response: ', data)
        }
      }
    )
  }

  isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
  };

  getGame = async () => {
    await axios.get(BASE_URL + `local_games/${this.gameId}`, { 
      params: { 
        codename: this.codename 
      }, 
      headers: { 
        'content-type': 'application/JSON'
      } 
    })
    .then((response) => {
      this.setState({
        ...response.data
      })
    })
  }

  handleDataReceipt = (data) => {
    console.log("Data received: ", data)
    this.setState({
      ...data
    })
  }

  handleFlip = (id) => {
    if (this.state.role === 'operative') {
      this.gameChannel.send({
        cell_id: id
      })
      this.timerChannel.send({
        resetId: `${id}` 
      })
    }
  }

  setRole = () => {
    if (this.state.role === "spymaster") {
      this.setState({ role: "operative" })
    } else {
        Alert.alert(
          'Are you sure you want to view the Spymaster key?',
          null,
          [
            { text: 'Show key', onPress: () => this.setState({ role: "spymaster" }) },
            {
              text: 'Cancel',
              style: 'cancel',
            }
          ],
          { cancelable: false },
        );  
    }
  }

  renderRow = (rowIndexes) => {
    let orderedDeck = this.state.cells.sort((a, b) => a.position - b.position)
    let row = rowIndexes.map((i) => {
      return orderedDeck[i]
    })

    return row.map((card) => {
      return (
        <Card
          role={this.state.role}
          key={card.word}
          onPress={() => { this.handleFlip(card.cell_id) }}
          cardStyle={style(this.state.orientation).card}
          imageStyle={style(this.state.orientation).cardImage}
          textStyle={
            (card.flipped_status === "up") ?
              style(this.state.orientation, this.state.role).flippedText 
              : style(this.state.orientation, this.state.role).cardText
          }
          value={card.word}
          color={card.color}
          flippedStatus={card.flipped_status}
          orientation={this.state.orientation}
        />
      )
    })
  }

  renderDeck = (positions) => {
    return positions.map((row, i) => {
      return (
        <View key={i} style={style().row}>
          {this.renderRow(row)}
        </View>
      )
    })
  }

  renderLogo = () => {
    return (
      <View style={style(this.state.orientation).logoWrapper}>
        <Image
          source={require('../../assets/images/CodenamesLogoWhite.png')}
          style={style(this.state.orientation).logo}
        />
      </View>
    )
  }

  renderScoreboard = () => {
    if (typeof this.state.blue_score !== 'undefined') {
      return (
        <Scoreboard
          scoreboardStyle={style(this.state.orientation).scoreboard}
          redStyle={style(this.state.orientation).redBoard} 
          blueStyle={style(this.state.orientation).blueBoard}
          textStyle={style(this.state.orientation).scoreboardText} 
          redScore={this.state.red_score}
          redTotal={this.state.red_total}
          blueScore={this.state.blue_score}
          blueTotal={this.state.blue_total}
          timerWrapper={style(this.state.orientation).timerWrapper}
          iconSize={26}
          gameId={this.gameId}
        />
      )
    }
  }

  renderButtons = () => {
    return (
      <GameboardButtons 
        buttonsWrapper={style(this.state.orientation).buttonsWrapper}
        buttonContainer={style(this.state.orientation).buttonContainer}
        buttonStyle={style(this.state.orientation).button}
        buttonTitle={style(this.state.orientation).buttonTitle}
        orientation={this.state.orientation}
        goHome={() => this.props.navigation.navigate('Home')}
        setRole={this.setRole}
        navigation={this.props.navigation}
      />
    )
  }

  renderGameData = () => {
    return (
      <GameData 
        dataWrapper={style(this.state.orientation).dataWrapper}
        idWrapper={style(this.state.orientation).idWrapper}
        codeWrapper={style(this.state.orientation).codeWrapper}
        textStyle={style(this.state.orientation).gameDataText}
        gameId={this.gameId}
        codename={this.codename}
      />
    )
  }

  renderResult = () => {
    return (
      <Result 
        orientation={this.state.orientation}
        result={this.state.result}
        role={this.state.role}
      />
    )
  }

  renderAssassin = () => {
    return (
      <Image
        source={require('codenamesReactNative/src/assets/images/Assassin.png')}
        style={style(this.state.orientation).assassin}>
      </Image>
    )
  }

  render() {
    return (
      <SafeAreaView style={style().safeArea}>
        <ImageBackground
          source={require('codenamesReactNative/src/assets/images/BlackTexturedBackground.jpg')}
          style={style().imageBackgroundFull}
          imageStyle={style().imageStyleFull}>
          <View style={style(this.state.orientation).screen}>
            {this.renderLogo()}
            <View style={style(this.state.orientation).gameWrapper}>
              <View style={style(this.state.orientation).board}>
                {(this.state.cells) ? this.renderDeck(this.positions) : null}
              </View>
              <View style={style(this.state.orientation).infoWrapper}>
                {this.renderScoreboard()}
                {this.renderButtons()}
                {(this.state.cells) ? this.renderResult() : null}
                {this.renderGameData()}
                {this.renderAssassin()}
              </View>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    )
  }
}

const style = (orientation = null, role = null) => {
  return StyleSheet.create({
    screen: {
      paddingHorizontal: 5,
      paddingTop: (orientation === 'portrait') ? 5 : 0,
      flex: 1
    },
    safeArea: {
      flex: 1, 
      backgroundColor: 'transparent'
    },
    gameWrapper: {
      flexDirection: (orientation === 'portrait') ? 'column' : 'row',
      paddingVertical: (orientation === 'portrait') ? 0 : 12,
      flex: 1
    },
    infoWrapper: {
      flex: 1
    },
    cardText: {
      fontSize: (orientation === 'portrait') ? 12 : 14,
      fontFamily: fonts.homeButtons,
      fontWeight: 'bold', 
      textTransform: 'uppercase',
      color: (role === 'spymaster') ? 'white' : 'black'
    },
    flippedText: {
      fontSize: (orientation === 'portrait') ? 12 : 14,
      fontFamily: fonts.homeButtons,
      fontWeight: (role === 'operative') ? 'bold' : null,
      textTransform: 'uppercase',
      color: 'white',
      textDecorationLine: (role === 'spymaster') ? 'line-through' : null,
      textDecorationStyle: 'double'
    },
    card: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.lightGray,
      paddingVertical: 3,
      paddingHorizontal: 3,
      marginHorizontal: 2,
      marginVertical: 3,
      borderRadius: 5,
      overflow: 'hidden'
    },
    row: {
      flexDirection: 'row',
      flex: 1
    },
    board: {
      zIndex: 1,
      flex: (orientation === 'portrait') ? 1.5 : 2.4, 
      justifyContent: 'space-evenly',
      paddingVertical: (orientation === 'portrait') ? 10 : 0,
      paddingRight: (orientation === 'portrait') ? 0 : 10,
      borderRightWidth: (orientation === 'portrait') ? 0 : 1,
      borderRightColor: (orientation === 'portrait') ? null : 'white',
    },
    logoWrapper: { 
      height: (orientation === 'portrait') ? 50 : 40, 
      justifyContent: 'center',
      alignItems: 'center', 
      borderBottomWidth: 1, 
      borderBottomColor: 'white',
      zIndex: 1
    },
    logo: { 
      width: '50%', 
      height: (orientation === 'portrait') ? 48 : 28, 
      justifyContent: 'center', 
      alignItems: 'center', 
      resizeMode: 'contain' 
    },
    cardImage: {
      width: '200%',
      resizeMode: 'contain',
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black'
    },
    scoreboard: {
      marginHorizontal: 2,
      flexDirection: 'row',
      flex: 1,
      maxHeight: 50,
      borderTopColor: 'white',
      borderTopWidth: (orientation === 'portrait') ? 1 : null,
      paddingTop: (orientation === 'portrait') ? 12 : 2,
      marginLeft: (orientation === 'portrait') ? 0 : 12,
    },
    redBoard: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 5,
      borderRadius: 5,
      backgroundColor: colors["red-agent-light"]
    },
    blueBoard: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 5,
      borderRadius: 5,
      backgroundColor: colors["blue-agent-light"]
    },
    scoreboardText: {
      color: 'white',
      fontWeight: 'bold',
      fontFamily: fonts.homeButtons,
      fontSize: 18
    },
    timerWrapper: {
      flex: 0.5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.lightGray,
      borderRadius: 5
    },
    buttonsWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderTopColor: 'white',
      borderTopWidth: 1,
      marginTop: 12,
      marginLeft: (orientation === 'portrait') ? 0 : 9.5,
    },
    buttonContainer: {
      flex: 1,
      marginTop: 12,
      marginHorizontal: 2.5
    },
    button: {
      borderRadius: 6,
      backgroundColor: colors.lightGray
    },
    buttonTitle: {
      color: colors.darkGray,
      fontFamily: fonts.homeButtons,
      fontSize: 12,
      fontFamily: fonts.homeButtons,
      fontWeight: 'bold',
      marginLeft: (orientation === 'portrait') ? -6 : 0
    },
    dataWrapper: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      flexDirection: (orientation === 'portrait') ? 'row' : 'column',
      width: (orientation === 'portrait') ? '75%' : '92%',
      borderTopColor: 'white',
      borderTopWidth: 1,
      marginTop: 12,
      marginLeft: (orientation === 'portrait') ? 0 : 12,
      marginRight: (orientation === 'portrait') ? 0 : 5,
      paddingVertical: 8,
      overflow: 'visible'
    },
    idWrapper: {
      flex: 1,
      borderRightWidth: (orientation === "portrait") ? 1 : 0,
      borderRightColor: 'white',
      paddingLeft: (orientation === "portrait") ? 2.5 : 8
    },
    gameDataText: {
      fontFamily: fonts.homeButtons,
      fontSize: 14,
      fontWeight: 'bold',
      color: 'white'
    },
    codeWrapper: {
      flex: 2,
      paddingLeft: (orientation === "portrait") ? 10 : 8,
      overflow: 'visible'
    },
    assassin: {
      height: (orientation === 'portrait') ? '160%' : '110%',
      opacity: 0.35,
      resizeMode: 'contain',
      position: 'absolute',
      zIndex: -1,
      bottom: -40,
      left: (orientation === 'portrait') ? 0 : -85
    },
    imageBackgroundFull: {
      width: '100%',
      height: '100%',
    },
    imageStyleFull: {
      resizeMode: 'cover',
    },
  })
}