import React from 'react'
import ActionCable from 'react-native-actioncable'
import { View, SafeAreaView, Image, Dimensions, ImageBackground, Alert, StatusBar } from 'react-native'
import Card from '../../components/game/card'
import { Result } from '../../components/game/result'
import { GameData } from '../../components/game/gameData'
import { GameboardButtons } from '../../components/game/gameboardButtons'
import { Scoreboard } from '../../components/game/scoreboard'
import NextGame from '../../components/game/nextGame'
import { BASE_URL } from '../../utils/requests'
import { colors, fonts } from '../../utils/styles'
import { ScaledSheet } from 'react-native-size-matters'
import axios from 'axios'

export default class GameScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      role: this.props.navigation.getParam('role'),
      isDarkMode: this.props.screenProps.isDarkMode,
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
    // this.cable = ActionCable.createConsumer('ws://0.0.0.0:3001/cable')
  }

  componentDidMount() {
    this.getGame()

    const dim = Dimensions.get('screen')
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
          key={card.word}
          role={this.state.role}
          onPress={() => { this.handleFlip(card.cell_id) }}
          cardStyle={style(this.state).card}
          imageStyle={style(this.state).cardImage}
          flippedSpymasterImageStyle={style(this.state).flippedSpymasterImage}
          textStyle={
            (card.flipped_status === "up") ?
              style(this.state).flippedText 
              : style(this.state).cardText
          }
          value={card.word}
          color={card.color}
          flippedStatus={card.flipped_status}
          orientation={this.state.orientation}
          isDarkMode={this.state.isDarkMode}
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
    const logoUri = this.state.isDarkMode ? 'codenames_logo_white' : 'codenames_logo_black'
    return (
      <View style={style(this.state).logoWrapper}>
        <Image
          source={{ uri: logoUri }}
          style={style(this.state).logo}
        />
      </View>
    )
  }

  renderScoreboard = () => {
    if (typeof this.state.blue_score !== 'undefined') {
      return (
        <Scoreboard
          scoreboardStyle={style(this.state).scoreboard}
          redStyle={style(this.state).redBoard} 
          blueStyle={style(this.state).blueBoard}
          textStyle={style(this.state).scoreboardText} 
          redScore={this.state.red_score}
          redTotal={this.state.red_total}
          blueScore={this.state.blue_score}
          blueTotal={this.state.blue_total}
          timerWrapper={style(this.state).timerWrapper}
          iconSize={26}
          gameId={this.gameId}
          orientation={this.state.orientation}
          isDarkMode={this.state.isDarkMode}
        />
      )
    }
  }

  renderButtons = () => {
    return (
      <GameboardButtons 
        buttonsWrapper={style(this.state).buttonsWrapper}
        buttonContainer={style(this.state).buttonContainer}
        buttonStyle={style(this.state).button}
        buttonTitle={style(this.state).buttonTitle}
        orientation={this.state.orientation}
        goHome={() => this.props.navigation.navigate('Home')}
        setRole={this.setRole}
        navigation={this.props.navigation}
        iconColor={
          this.state.isDarkMode
            ? colors.black
            : colors.lightGray
        }
      />
    )
  }

  renderGameData = () => {
    return (
      <GameData 
        dataWrapper={style(this.state).dataWrapper}
        idWrapper={style(this.state).idWrapper}
        codeWrapper={style(this.state).codeWrapper}
        textStyle={style(this.state).gameDataText}
        gameId={this.gameId}
        codename={this.codename}
      />
    )
  }

  renderNextGame = () => {
    return (
      <NextGame
        orientation={this.state.orientation}
        navigation={this.props.navigation}
        isDarkMode={this.state.isDarkMode}
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
        source={require('RNcodenames0605/src/assets/images/Assassin.png')}
        style={style(this.state).assassin}>
      </Image>
    )
  }

  render() {
    backgroundUri = this.state.isDarkMode ? 'black_textured_background' : 'white_textured_background'
    return (
      <>
        <SafeAreaView style={style().safeArea}>
          <StatusBar barStyle="light-content" />
          <ImageBackground
            source={{ uri: backgroundUri }}
            style={style().imageBackgroundFull}
            imageStyle={style().imageStyleFull}>
            <View style={style(this.state).screen}>
              {this.renderLogo()}
              <View style={style(this.state).gameWrapper}>
                <View style={style(this.state).board}>
                  {(this.state.cells) ? this.renderDeck(this.positions) : null}
                </View>
                <View style={style(this.state).infoWrapper}>
                  {this.renderScoreboard()}
                  {this.renderButtons()}
                  {(this.state.cells) ? this.renderResult() : null}
                  {(this.state.result) ? this.renderNextGame() : this.renderGameData()}
                  {this.renderAssassin()}
                </View>
              </View>
            </View>
          </ImageBackground>
        </SafeAreaView>
      </>
    )
  }
}

const style = (state = null) => {
  let orientation, role, isDarkMode
  if (state) {
    orientation = state.orientation
    role = state.role
    isDarkMode = state.isDarkMode
  }
  return ScaledSheet.create({
    screen: {
      paddingHorizontal: '5@s',
      paddingTop: (orientation === 'portrait') ? '5@s' : 0,
      flex: 1
    },
    safeArea: {
      flex: 1, 
      backgroundColor: 'black'
    },
    gameWrapper: {
      flexDirection: (orientation === 'portrait') ? 'column' : 'row',
      paddingVertical: (orientation === 'portrait') ? 0 : '12@s',
      flex: 1
    },
    infoWrapper: {
      flex: 1
    },
    cardText: {
      fontSize: (orientation === 'portrait') ? '12@s' : '14@s',
      fontFamily: fonts.condensedMain,
      fontWeight: 'bold', 
      textTransform: 'uppercase',
      color: (role === 'spymaster') ? 'white' : 'black',
      paddingHorizontal: '3@s'
    },
    flippedText: {
      fontSize: (orientation === 'portrait') ? '12@s' : '14@s',
      fontFamily: fonts.condensedMain,
      fontWeight: (role === 'operative') ? 'bold' : null,
      textTransform: 'uppercase',
      color: 'white',
      textDecorationLine: (role === 'spymaster') ? 'line-through' : null,
      textDecorationStyle: 'solid',
      fontWeight: 'bold',
      paddingHorizontal: '3@s'
    },
    card: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.white,
      marginHorizontal: '2@s',
      marginVertical: '3@s',
      borderRadius: '5@s',
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
      paddingVertical: (orientation === 'portrait') ? '10@s' : 0,
      paddingRight: (orientation === 'portrait') ? 0 : '10@s',
      borderRightWidth: (orientation === 'portrait') ? 0 : 1,
      borderColor: (orientation === 'portrait') 
        ? null 
        : isDarkMode 
          ? colors.white 
          : colors.darkGray,
    },
    logoWrapper: { 
      height: (orientation === 'portrait') ? '50@s' : '40@s', 
      justifyContent: 'center',
      alignItems: 'center', 
      borderBottomWidth: 1, 
      borderBottomColor: isDarkMode 
        ? colors.white 
        : colors.darkGray,
      zIndex: 1
    },
    logo: { 
      width: '50%', 
      height: (orientation === 'portrait') ? '48@s' : '28@s', 
      justifyContent: 'center', 
      alignItems: 'center', 
      resizeMode: 'contain' 
    },
    cardImage: {
      width: (orientation === "portrait") ? '180%' : '200%',
      height: (orientation === "portrait") ? '180%' : '200%',
      resizeMode: 'contain',
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      opacity: 0.92
    },
    flippedSpymasterImage: {
      width: '180%',
      height: '180%',
      resizeMode: 'contain',
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      opacity: 0.6
    },
    scoreboard: {
      marginHorizontal: '2@s',
      flexDirection: 'row',
      flex: 1,
      maxHeight: '50@s',
      borderTopColor: isDarkMode 
        ? colors.white 
        : colors.darkGray,
      borderTopWidth: (orientation === 'portrait') ? 1 : null,
      paddingTop: (orientation === 'portrait') ? '12@s' : '2@s',
      marginLeft: (orientation === 'portrait') ? 0 : '12@s',
    },
    redBoard: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '5@s',
      borderRadius: '5@s',
      backgroundColor: colors["red-agent"]
    },
    blueBoard: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '5@s',
      borderRadius: '5@s', 
      backgroundColor: colors["blue-agent"]
    },
    scoreboardText: {
      color: 'white',
      fontWeight: 'bold',
      fontFamily: fonts.main,
      fontSize: '18@s'
    },
    timerWrapper: {
      flex: 0.5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.lightGray,
      borderRadius: '5@s'
    },
    buttonsWrapper: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderTopColor: isDarkMode 
        ? colors.white 
        : colors.darkGray,
      borderTopWidth: 1,
      marginTop: '12@s',
      marginLeft: (orientation === 'portrait') ? 0 : '9.5@s',
    },
    buttonContainer: {
      flex: 1,
      marginTop: '12@s',
      marginHorizontal: '2.5@s'
    },
    button: {
      borderRadius: '6@s',
      backgroundColor: isDarkMode
        ? colors.lightGray
        : colors.black
    },
    buttonTitle: {
      color: isDarkMode
        ? colors.darkGray
        : colors.white,
      fontFamily: fonts.main,
      fontSize: '12@s',
      fontFamily: fonts.main,
      fontWeight: 'bold',
      marginLeft: (orientation === 'portrait') ? '-6@s' : 0
    },
    dataWrapper: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      flexDirection: (orientation === 'portrait') ? 'row' : 'column',
      width: (orientation === 'portrait') ? '75%' : '92%',
      borderTopColor: isDarkMode 
        ? colors.white 
        : colors.darkGray,
      borderTopWidth: 1,
      marginTop: '12@s',
      marginLeft: (orientation === 'portrait') ? 0 : '12@s',
      marginRight: (orientation === 'portrait') ? 0 : '5@s',
      paddingTop: '8@s',
      paddingBottom: (orientation === 'portrait') ? '8@s' : 0,
      overflow: 'visible'
    },
    idWrapper: {
      flex: 1,
      borderRightWidth: (orientation === "portrait") ? 1 : 0,
      borderColor: isDarkMode 
        ? colors.white 
        : colors.darkGray,
      paddingLeft: (orientation === "portrait") ? '2.5@s' : '8@s'
    },
    gameDataText: {
      fontFamily: fonts.condensedMain,
      fontSize: '17@s',
      fontWeight: 'bold',
      color: isDarkMode 
        ? colors.white 
        : colors.black
    },
    codeWrapper: {
      flex: 2,
      paddingLeft: (orientation === "portrait") ? '10@s' : '8@s',
      overflow: 'visible'
    },
    assassin: {
      height: (orientation === 'portrait') ? '160%' : '110%',
      opacity: 0.3,
      resizeMode: 'contain',
      position: 'absolute',
      zIndex: -1,
      bottom: -40,
      left: (orientation === 'portrait') ? 15 : -100
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