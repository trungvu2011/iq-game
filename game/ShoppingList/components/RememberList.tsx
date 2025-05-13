import { View, Text, StyleSheet } from 'react-native'
import React, { memo } from 'react'
import Board from './Board';

interface RememberListProps {
  correctItems?: number[];
}

const RememberList = ({ correctItems }: RememberListProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.memorizeText}>Memorize these items</Text>
      <Board
        items={correctItems ? correctItems : []}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  memorizeText: {
    fontSize: 18,
    color: '#fff',
    backgroundColor: '#00000050',
    width: '80%',
    textAlign: 'center',
    borderRadius: 5,
  },

});
export default RememberList