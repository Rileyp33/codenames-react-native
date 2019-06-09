import React from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'
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
      gameId: 0
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

  componentDidUpdate() {
    console.log(this.state.cells)
  }

  componentDidMount() {
    this.getGame()
  }

  renderRow = (rowIndexes) => {
    let orderedDeck = this.state.cells.sort((a, b) => a.position - b.position)
    let row = rowIndexes.map((i) => {
      return orderedDeck[i]
    })
    return row.map((card) => {
      return (
        <TouchableOpacity onPress={() => { console.log(card) }} style={{ flex: 1, alignItems: 'center', backgroundColor: 'orange', borderWidth: 2 }}>
          <Text>{card.word}</Text>
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