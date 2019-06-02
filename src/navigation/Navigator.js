import { createStackNavigator, createAppContainer } from 'react-navigation'
import HomeScreen from './home'

export default createNavigator = () => { 
  return createAppContainer(createStackNavigator(
    { 
      Home: HomeScreen
    },
    {
      initialRouteName: 'Home',
      headerMode: 'none'
    }
  ))
}