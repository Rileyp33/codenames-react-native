import React, {Component} from 'react';
// import {Platform, StyleSheet, Text, View} from 'react-native';
import createNavigator from './src/navigation/Navigator'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.Navigator = createNavigator()
  }

  render() {
    const Navigator = this.Navigator

    return (
      <React.Fragment>
        <Navigator/>
      </React.Fragment>
    )
  }
}

// Disables yellow box debug tools
console.disableYellowBox = true
