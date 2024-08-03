import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import ChangeBalanceScreen from '../screens/ChangeBalanceScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import 'react-native-gesture-handler';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerContent = (props) => (
  <LinearGradient
    colors={['#2a004f', '#000000', '#2a004f']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={StyleSheet.absoluteFill}
  >
    <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill}>
      <DrawerContentScrollView {...props} style={styles.drawerContent}>
        <DrawerItem
          label="Strona główna"
          onPress={() => props.navigation.navigate('Home')}
          icon={() => <Ionicons name="home" size={24} color="#007BFF" />}
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          label="Moje wydatki"
          onPress={() => props.navigation.navigate('Expenses')}
          icon={() => <Ionicons name="list" size={24} color="#4CAF50" />}
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          label="Edytuj saldo"
          onPress={() => props.navigation.navigate('ChangeBalance')}
          icon={() => <Ionicons name="wallet" size={24} color="#4CAF50" />}
          labelStyle={styles.drawerLabel}
        />
      </DrawerContentScrollView>
    </BlurView>
  </LinearGradient>
);

const MainStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#1e1e1e' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen 
      name="Home" 
      component={HomeScreen} 
      options={({ navigation }) => ({
        title: 'Strona Główna',
        headerLeft: () => (
          <Ionicons 
            name="menu" 
            size={24} 
            color="white" 
            onPress={() => navigation.toggleDrawer()} 
            style={{ marginLeft: 10 }}
          />
        ),
      })} 
    />
    <Stack.Screen name="Expenses" component={ExpensesScreen} options={{ title: 'Wydatki' }} />
    <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: 'Dodaj Wydatek' }} />
    <Stack.Screen name="ChangeBalance" component={ChangeBalanceScreen} options={{ title: 'Edytuj Saldo' }} />
  </Stack.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Drawer.Navigator 
      drawerContent={(props) => <DrawerContent {...props} />} 
      drawerStyle={{ backgroundColor: 'transparent' }}
      screenOptions={{
        drawerType: 'front',
        overlayColor: 'transparent',
        sceneContainerStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Drawer.Screen name="MainStack" component={MainStackNavigator} options={{ headerShown: false }} />
    </Drawer.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  drawerLabel: {
    color: '#ffffff',
  },
});

export default AppNavigator;
