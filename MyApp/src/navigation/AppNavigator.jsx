import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/main/HomeScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import { darkTheme } from '../theme';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const [headerMode, setHeaderMode] = useState('Trending');
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#ffffff',
        tabBarStyle: {backgroundColor: darkTheme.colors.background, borderTopWidth: 0},
        headerStyle: { backgroundColor: darkTheme.colors.background },
        tabBarIcon: ({ focused, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-circle';
          }
          return <Ionicons name={iconName} size={size} color={'#ffffff'} />;
        },
      })}
    >
      <Tab.Screen 
        name="Home"
        options={{
          headerTitleAlign: 'center',
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              {['Trending', 'Practice'].map((label, idx) => {
                const isActive = headerMode === label;
                return (
                  <Pressable
                    key={label}
                    onPress={() => setHeaderMode(label)}
                    style={{ marginLeft: idx === 0 ? 0 : 60 }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '600',
                        color: isActive ? darkTheme.colors.text : darkTheme.colors.muted,
                      }}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ),
        }}
      >
        {() => <HomeScreen mode={headerMode} />}
      </Tab.Screen>
      <Tab.Screen name="Settings" component={SettingsScreen} 
        options={{ headerTitleAlign: 'center',
          headerTitle: () => (
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: darkTheme.colors.text,
              }}
            >
              Settings
            </Text>
          ) }} />
    </Tab.Navigator>
  );
}
