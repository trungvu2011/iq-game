import React from 'react';
import { View } from 'react-native';
import Nonogram from './game/Nonogram/Nonogram';

const App = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Nonogram />
    </View>
  );
};
export default App;