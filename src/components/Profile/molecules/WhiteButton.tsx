import { StyleSheet } from 'react-native'
import React from 'react'
import { Button } from '@rneui/themed'

export default function WhiteButton({text, onPress}: any) {
  return (
      <Button
          containerStyle={styles.container}
          titleStyle={styles.title}
          buttonStyle={styles.button}
          onPress={onPress}
      >{text}</Button>
  )
}

const styles = StyleSheet.create({
    container: {
    },
    title: {
        color: '#000000'
    },
    button: {
        width: '100%',
        backgroundColor: '#FFFFFF',
    }
})