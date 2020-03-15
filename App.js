import React, { useEffect } from 'react'
import createNavigator from './src/navigation/Navigator'
import { useDarkMode } from 'react-native-dark-mode'
import SplashScreen from 'react-native-splash-screen'

const App = () => {
  useEffect(() => {
    SplashScreen.hide()
  }, [])
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


