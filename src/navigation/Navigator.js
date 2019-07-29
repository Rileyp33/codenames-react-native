import { createStackNavigator, createAppContainer } from 'react-navigation'
import HomeScreen from './home'
import GameScreen from './game'
import LobbyScreen from './lobby'
import NewGameScreen from './newGame'
import RulesScreen from './rules'

export default createNavigator = () => { 
  return createAppContainer(createStackNavigator(
    { 
      Home: HomeScreen,
      NewGame: NewGameScreen,
      Lobby: LobbyScreen,
      Rules: RulesScreen,
      Game: {
        screen: GameScreen,
        navigationOptions: {
          gesturesEnabled: false
        }
      }
    },
    {
      initialRouteName: 'Home',
      headerMode: 'none'
    }
  ))
}