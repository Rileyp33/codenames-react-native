import { createStackNavigator, createAppContainer } from 'react-navigation'
import HomeScreen from './home'
import GameScreen from './game'

export default createNavigator = () => { 
  return createAppContainer(createStackNavigator(
    { 
      Home: HomeScreen,
      Game: {
        screen: GameScreen,
        navigationOptions: {
          gesturesEnabled: false
        }
      }
    },
    {
      initialRouteName: 'Game',
      headerMode: 'none'
    }
  ))
}