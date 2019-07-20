import React from 'react'
import { View, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize"
import { GlobalText } from '../../components/globalText'
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
    this.tempGame = 3

    this.positions = [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24]
    ]
  }

  componentDidUpdate() {
    console.log(this.state.cells)
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
          cells: response.data.cells,
          redScore: response.data.redScore,
          redTotal: response.data.redTotal,
          blueScore: response.data.blueScore,
          blueTotal: response.data.blueTotal,
          assassin: response.data.assassin,
          result: response.data.result
        })
      })
  }

  renderRow = (rowIndexes) => {
    let orderedDeck = this.state.cells.sort((a, b) => a.position - b.position)
    let row = rowIndexes.map((i) => {
      return orderedDeck[i]
    })
    return row.map((card) => {
      return (
        <TouchableOpacity key={card.word} onPress={() => { console.log(card) }} style={style(this.state.orientation).card}>
          <GlobalText
            value={card.word}
            style={style(this.state.orientation).cardText}>
          </GlobalText>
        </TouchableOpacity>
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
    card: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.lightGray,
      fontSize: style.portrait,
      paddingVertical: 5,
      marginHorizontal: 1,
      paddingHorizontal: 5,
      justifyContent: 'center',
      borderRadius: 5,
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
    }
  })
}