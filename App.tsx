import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {RootStackParamList} from 'navigation/RootNav';
import QuestionList from './components/QuestionList';
import QuestionDetail from './components/QuestionDetail';

declare var global: {HermesInternal: null | {}};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="QuestionList"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="QuestionList" component={QuestionList} />
        <Stack.Screen name="QuestionDetail" component={QuestionDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
