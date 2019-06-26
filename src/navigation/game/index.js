import React from 'react'
import { Text, View, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import { GlobalText } from '../../components/globalText'
import { BASE_URL } from '../../utils/requests'
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
    this.tempGame = 11

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
        <TouchableOpacity onPress={() => { console.log(card) }} style={{ flex: 1, alignItems: 'center', backgroundColor: 'orange', borderWidth: 2, fontSize: style.portrait }}>
          <GlobalText
            value={card.word}
            style={style(this.state.orientation).cardText}>
          </GlobalText>
        </TouchableOpacity>
      )
    })
  }

  renderDeck = (positions) => {
    return positions.map((row) => {
      return (
        <View style={{ flexDirection: 'row' }}>
          {this.renderRow(row)}
        </View>
      )
    })
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'space-evenly'}}>
        {(this.state.cells) ? this.renderDeck(this.positions) : null}
      </View>
    )
  }
}

const style = (orientation) => {
  return StyleSheet.create({
    cardText: {
      fontSize: (orientation === 'portrait') ? RFValue(8) : RFValue(14),
      textTransform: 'uppercase'
    }
  })
}