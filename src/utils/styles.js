import { ScaledSheet } from 'react-native-size-matters'

export const colors = {
  "lightestGray": '#e6e6e6',
  "lightGray": '#d9d9d9',
  "darkGray": '#545454',
  "red-agent": '#a31600',
  "red-agent-light": '#bd3200',
  "blue-agent": '#0a1b67',
  "blue-agent-light": '#0e289a',
  "white": '#fff',
  "black": '#000'
}

export const fonts = {
  main: 'Karla',
  condensedMain: 'AvenirNextCondensed-Medium',
  condensedAlt: 'Futura-CondensedMedium',
  headers: 'Futura'
}

export const globalStyles = ScaledSheet.create({
  shadow: {
    elevation: 20,
    shadowColor: colors.black,
    shadowOpacity: 0.8,
    shadowRadius: '6@vs',
    shadowOffset: {
      width: 0,
      height: '3@s'
    }
  }
})