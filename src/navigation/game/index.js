import React from 'react'
import ActionCable from 'react-native-actioncable'
import { View, Image, StyleSheet, Dimensions } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize"
import { Card } from '../../components/game/card'
import { BASE_URL } from '../../utils/requests'
import { colors, fonts } from '../../utils/styles'
import axios from 'axios'


export default class GameScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      role: 'operative',
      cells: null,
      redScore: 0,
      redTotal: 0,
      blueScore: 0,
      blueTotal: 0,
      assassin: 0,
      result: null,
      timer: false,
      gameId: 0,
      orientation: 'portrait'
    }

    // this.tempGame = this.props.navigation.getParam('gameId')
    this.tempGame = 4

    this.positions = [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24]
    ]

    this.cable = ActionCable.createConsumer('ws://10.0.0.35:3000/cable')
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
        game_id: this.tempGame
      },
      {
        connected: () => console.log("GameChannel connected"),
        disconnected: () => console.log("GameChannel disconnected"),
        received: data => {
          this.handleDataReceipt(data)
        }
      }
    )
  }

  componentDidUpdate() {
    console.log("State updated to: ", this.state)
  }

  isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
  };

  getGame = async () => {
    let gameId = this.tempGame
    axios.get(BASE_URL + `local_games/${gameId}`)
      .then(response => {
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
          onPress={() => { this.handleFlip(card.cell_id) }}
          cardStyle={style(this.state.orientation).card}
          imageStyle={style(this.state.orientation).cardImage}
          textStyle={
            (card.flipped_status === "up") ?
              style(this.state.orientation).flippedText 
              : style(this.state.orientation).cardText
          }
          value={card.word}
          color={card.color}
          flippedStatus={card.flipped_status}
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
          source={require('../../assets/images/CodenamesLogoBlack.png')}
          style={style(this.state.orientation).logo}
        />
      </View>
    )
  }

  render() {
    return (
      <View style={style(this.state.orientation).screen}>
        {this.renderLogo()}
        <View style={style().board}>
          {(this.state.cells) ? this.renderDeck(this.positions) : null}
        </View>
      </View>
    )
  }
}

const style = (orientation = null) => {
  return StyleSheet.create({
    screen: {
      marginHorizontal: 4,
      marginVertical: (orientation === 'portrait') ? 20 : 0,
      flex: 1
    },
    cardText: {
      fontSize: (orientation === 'portrait') ? RFValue(10) : RFValue(14),
      fontFamily: fonts.homeButtons,
      fontWeight: 'bold', 
      textTransform: 'uppercase'
    },
    flippedText: {
      fontSize: (orientation === 'portrait') ? RFValue(10) : RFValue(14),
      fontFamily: fonts.homeButtons,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      color: 'white'
    },
    card: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.lightGray,
      paddingVertical: 5,
      marginHorizontal: 1,
      paddingHorizontal: 5,
      borderRadius: 5,
      overflow: 'hidden'
    },
    row: {
      flexDirection: 'row'
    },
    board: {
      flex: 1, 
      justifyContent: 'space-evenly',
      maxHeight: 300
    },
    logoWrapper: { 
      marginHorizontal: 14, 
      height: (orientation === 'portrait') ? 50 : 30, 
      justifyContent: 'center',
      alignItems: 'center', 
      borderBottomWidth: 1, 
      borderBottomColor: colors.lightGray 
    },
    logo: { 
      width: '50%', 
      height: (orientation === 'portrait') ? 40 : 20, 
      justifyContent: 'center', 
      alignItems: 'center', 
      resizeMode: 'contain' 
    },
    cardImage: {
      width: '125%',
      resizeMode: 'contain',
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center' 
    }
  })
}