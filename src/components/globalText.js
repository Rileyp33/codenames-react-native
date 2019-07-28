import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize"

export const GlobalText = (props) => {
  return (
    <Text style={style(props).text}>
      {props.value}
    </Text>
  )
}

const style = (props) => {
  const styleProps = props.style
  return StyleSheet.create({
    text: (styleProps) ? {
      color: (styleProps.color) ? styleProps.color : 'black',
      fontWeight: (styleProps.fontWeight) ? styleProps.fontWeight : null,
      fontFamily: (styleProps.fontFamily) ? styleProps.fontFamily : 'System',
      fontSize: (styleProps.fontSize) ? styleProps.fontSize : 12,
      fontWeight: (styleProps.fontWeight) ? styleProps.fontWeight : null,
      textTransform: (styleProps.textTransform) ? styleProps.textTransform : null,
    } : null
  })
}