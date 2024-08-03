import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React from 'react';
import { registerRootComponent } from 'expo';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return <AppNavigator />;
};

export default App;

registerRootComponent(App);
