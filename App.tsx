import React from 'react';
import { View } from 'react-native';
import Nonogram from './game/Nonogram/Nonogram';
import MathAudit from './game/MathAudit/MathAudit';

const App = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* <Nonogram /> */}
      <MathAudit />
    </View>
  );
};
export default App;