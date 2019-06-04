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
    this.tempGame = 10

    this.rows = [
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

  renderRow1 = () => {
    let orderedDeck = this.state.cells.sort((a, b) => a.position - b.position)
    let row1 = [orderedDeck[0], orderedDeck[1], orderedDeck[2], orderedDeck[3], orderedDeck[4]]
    return row1.map((card) => {
      return(
        <View style={{ flex: 1, alignItems: 'center'}}>
          <TouchableOpacity>
            <Text>{card.word}</Text>
          </TouchableOpacity>
        </View>
      )
    })
  }

  renderRow2 = () => {
    let orderedDeck = this.state.cells.sort((a, b) => a.position - b.position)
    let row2 = [orderedDeck[5], orderedDeck[6], orderedDeck[7], orderedDeck[8], orderedDeck[9]]
    return row2.map((card) => {
      return (
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity>
            <Text style={{ color: 'black' }}>{card.word}</Text>
          </TouchableOpacity>
        </View>
      )
    })
  }

  renderRow3 = () => {
    let orderedDeck = this.state.cells.sort((a, b) => a.position - b.position)
    let row3 = [orderedDeck[10], orderedDeck[11], orderedDeck[12], orderedDeck[13], orderedDeck[14]]
    return row3.map((card) => {
      return (
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity>
            <Text style={{ color: 'black' }}>{card.word}</Text>
          </TouchableOpacity>
        </View>
      )
    })
  }

  renderRow4 = () => {
    let orderedDeck = this.state.cells.sort((a, b) => a.position - b.position)
    let row4 = [orderedDeck[15], orderedDeck[16], orderedDeck[17], orderedDeck[18], orderedDeck[19]]
    return row4.map((card) => {
      return (
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity>
            <Text style={{ color: 'black' }}>{card.word}</Text>
          </TouchableOpacity>
        </View>
      )
    })
  }

  renderRow5 = () => {
    let orderedDeck = this.state.cells.sort((a, b) => a.position - b.position)
    let row1 = [orderedDeck[0], orderedDeck[1], orderedDeck[2], orderedDeck[3], orderedDeck[4]]
    let row5 = [orderedDeck[20], orderedDeck[21], orderedDeck[22], orderedDeck[23], orderedDeck[24]]

    return row5.map((card) => {
      return (
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity>
            <Text style={{ color: 'black' }}>{card.word}</Text>
          </TouchableOpacity>
        </View>
      )
    })
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'space-evenly'}}>
        <View style={{flexDirection: 'row'}}>
          {(this.state.cells) ? this.renderRow1() : null}
        </View>
        <View style={{ flexDirection: 'row' }}>
          {(this.state.cells) ? this.renderRow2() : null}
        </View>
         <View style={{flexDirection: 'row'}}>
          {(this.state.cells) ? this.renderRow3() : null}
         </View>
         <View style={{flexDirection: 'row'}}>
          {(this.state.cells) ? this.renderRow4() : null}
        </View>
         <View style={{flexDirection: 'row'}}>
          {(this.state.cells) ? this.renderRow5() : null}
        </View>
      </View>
    )
  }
}