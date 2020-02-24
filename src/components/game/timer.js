import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import { fonts, colors } from '../../utils/styles'
import { ScaledSheet, scale } from 'react-native-size-matters'

export default class Timer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      timerActive: false,
      timer: 90
    }

    this.cable = ActionCable.createConsumer('wss://codenames-api-rp.herokuapp.com/cable')
    // this.cable = ActionCable.createConsumer('ws://0.0.0.0:3001/cable')
  }

  componentDidMount() {
    this.timerChannel = this.cable.subscriptions.create(
      {
        channel: 'TimerChannel',
        timer_id: this.props.gameId
      },
      {
        connected: () => console.log("TimerChannel connected"),
        disconnected: () => console.log("TimerChannel disconnected"),
        received: data => {
          this.setState({ timer: 90 })
          if (data.resetId) {
            clearInterval(this.state.timerActive)
            this.setState({ 
              timerActive: null,
              timer: 90
             })
          } else {
              this.runTimer()
          }
        }
      }
    )
  }

  componentWillUnmount() {
    clearInterval(this.state.timerActive)
  }

  runTimer = () => {
    if (this.state.timer === "Time!") {
      this.setState({ timer: 90 })
      return
    }

    let counter = () => {
      if (this.state.timer > 1) {
        this.setState({ timer: this.state.timer - 1 })
      } else if (this.state.timer === 1) {
          this.setState({ timer: "Time!" })
          clearInterval(this.state.timerActive)
          this.setState({ timerActive: null })
      }
    }

    if ( this.state.timerActive ) {
      return
    }
    
    this.timerChannel.send({
      timer: "start"
    })
    
    this.state.timerActive = setInterval(() => {
      counter()
    }, 1000)
  }

  formatTimerText = (time) => {
    if (time >= 70) {
      return `1:${time - 60}`
    } else if (time >= 60 && time < 70) {
        return `1:0${time - 60}`
    } else if (time < 60 && time >= 10) {
      return `0:${time}`
    } else if (time > 0 && time < 10) {
        return `0:0${time}`
    } else {
        return time
    }
  }

  renderTimerText = () => {
    return (
      <Text style={[
        style(this.props).timerText,
        this.state.timer === 'Time!'
          ? { fontSize: scale(12) }
          : null
      ]}>
        {this.formatTimerText(this.state.timer)}
      </Text>
    )
  }

  renderIcon = () => {
    const { isDarkMode } = this.props
    return (
      <Icon
        type={'ionicon'}
        name={'ios-hourglass'}
        size={24}
        color={
          isDarkMode
            ? colors.black
            : colors.white
        }
      />
    )
  }

  render() {
    return (
      <TouchableOpacity style={style(this.props).timerWrapper} onPress={() => { this.runTimer() }} disabled={this.state.timerActive}>
        {(this.state.timerActive || this.state.timer === "Time!") ? this.renderTimerText() : this.renderIcon()}
      </TouchableOpacity>
    )
  }
}

const style = (props) => (
  ScaledSheet.create({
    timerWrapper: {
      flex: 0.6,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props.isDarkMode
        ? colors.lightGray
        : colors.darkGray,
      borderRadius: 5
    },
    timerText: {
      color: props.isDarkMode
        ? colors.darkGray
        : colors.white,
      fontFamily: fonts.main,
      fontWeight: 'bold',
      fontSize: '14@s'
    }
  })
) 
