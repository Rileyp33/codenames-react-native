import React from 'react'
import createNavigator from './src/navigation/Navigator'
import { useDarkMode } from 'react-native-dark-mode'


const App = () => {
  const isDarkMode = { isDarkMode: useDarkMode() }
  const Navigator = createNavigator(isDarkMode)

  return (
    <React.Fragment>
      <Navigator screenProps={isDarkMode}/>
    </React.Fragment>
  )
}

export default App

// Disables yellow box debug tools
console.disableYellowBox = true


