import { createStackNavigator, createAppContainer } from 'react-navigation'
import HomeScreen from './home'
import GameScreen from './game'
import LobbyScreen from './lobby'

export default createNavigator = () => { 
  return createAppContainer(createStackNavigator(
    { 
      Home: HomeScreen,
      Game: {
        screen: GameScreen,
        navigationOptions: {
          gesturesEnabled: false
        }
      },
      Lobby: LobbyScreen,
    },
    {
      initialRouteName: 'Home',
      headerMode: 'none'
    }
  ))
}