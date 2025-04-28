import React from 'react';
import { View } from 'react-native';
import Nonogram from './game/Nonogram/Nonogram';
import MathAudit from './game/MathAudit/MathAudit';
import TrickyPatterns from './game/TrickyPatterns/TrickyPatterns';

const App = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* <Nonogram /> */}
      {/* <MathAudit /> */}
      <TrickyPatterns />
    </View>
  );
};
export default App;