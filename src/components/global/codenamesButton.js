import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { GlobalText } from '../global/globalText'
import { colors, fonts } from '../../utils/styles'
import { Icon } from 'react-native-elements'
import { ScaledSheet } from 'react-native-size-matters'
import LinearGradient from 'react-native-linear-gradient'

export const CodenamesButton = (props) => {
  const {
    value,
    icon,
    onPress,
    gradient
  } = props
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={styles(props).buttonContainer}
    >
      <LinearGradient
        colors={[gradient[0], gradient[1]]}
        style={styles(props).gradientContainer}
      >
        <Icon
          type={icon.type}
          name={icon.name}
          size={icon.size}
          color={icon.color}
          containerStyle={styles(props).iconContainer}
        />
        <View style={styles(props).textContainer}>
          <GlobalText
            value={value}
            style={styles(props).buttonText}
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = (props) => (
  ScaledSheet.create({
    buttonContainer: {
      height: '50@vs',
      marginTop: '10@vs',
      width: '100%',
      maxWidth: 350,
      borderRadius: '8@vs',
      elevation: 20,
      shadowColor: colors.black,
      shadowOpacity: 0.8,
      shadowRadius: '6@vs',
      shadowOffset: {
        width: 0,
        height: '3@s'
      }
    },
    gradientContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: '50@vs',
      borderRadius: '8@vs',
      opacity: props.disabled ? 0.8 : 1
    },
    textContainer: {
      alignItems: 'flex-start',
    },
    buttonText: {
      fontSize: '20@s',
      fontFamily: fonts.main,
      fontWeight: 'bold',
      color: props.textColor || colors.darkGray,
      opacity: props.disabled ? 0.3 : 1
    },
    buttonTextDisabled: {
      fontSize: '20@s',
      fontFamily: fonts.main,
      fontWeight: 'bold',
      color: props.textColor || colors.darkGray,
      opacity: 0.3
    },
    iconContainer: {
      alignItems: 'center',
      paddingLeft: '22%',
      paddingRight: '25@s',
      opacity: props.disabled ? 0.3 : 1
    }
  })
)