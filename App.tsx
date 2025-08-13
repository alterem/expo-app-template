import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import StyleScreen from './src/screens/StyleScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { RootTabParamList } from './src/types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Styles') {
              iconName = focused ? 'brush' : 'brush-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else {
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#34C759',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#34C759',
            height: 80,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: '首页',
            headerTitle: '一言',
          }}
        />
        <Tab.Screen 
          name="Styles" 
          component={StyleScreen}
          options={{
            title: '样式',
            headerTitle: '样式演示',
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            title: '我的',
            headerTitle: '个人中心',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
