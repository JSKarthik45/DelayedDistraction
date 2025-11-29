import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/main/HomeScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import { lightTheme } from '../theme';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const [headerMode, setHeaderMode] = useState('Trending');
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#ffffff',
        tabBarStyle: {
          height: 60,
          paddingTop: 2,
          paddingBottom: 16, // extra bottom space for safer tap target
        },
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
                        color: isActive ? lightTheme.colors.text : lightTheme.colors.muted,
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
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
