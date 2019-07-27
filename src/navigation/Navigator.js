import { createStackNavigator, createAppContainer } from 'react-navigation'
import HomeScreen from './home'
import GameScreen from './game'
import LobbyScreen from './lobby'
import NewGameScreen from './newGame'

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
      NewGame: NewGameScreen,
    },
    {
      initialRouteName: 'Home',
      headerMode: 'none'
    }
  ))
}