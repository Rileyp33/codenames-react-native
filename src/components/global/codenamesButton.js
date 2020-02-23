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
    onPress
  } = props
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.buttonContainer}
    >
      <LinearGradient
        colors={[colors.white, colors.lightestGray]}
        style={styles.gradientContainer}
      >
        <Icon
          type={icon.type}
          name={icon.name}
          size={icon.size}
          color={icon.color}
          containerStyle={styles.iconContainer}
        />
        <View style={styles.textContainer}>
          <GlobalText
            value={value}
            style={styles.buttonText}
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = ScaledSheet.create({
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
    borderRadius: '8@vs'
  },
  textContainer: {
    alignItems: 'flex-start',
  },
  buttonText: {
    fontSize: '20@s',
    fontFamily: fonts.main,
    fontWeight: 'bold',
    color: colors.darkGray
  },
  iconContainer: {
    alignItems: 'center',
    paddingLeft: '26%',
    paddingRight: '25@s'
  }
})