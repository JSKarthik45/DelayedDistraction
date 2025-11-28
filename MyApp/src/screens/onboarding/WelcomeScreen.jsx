import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CircleButton from '../../components/CircleButton';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Onboarding starts here.</Text>

      <CircleButton
        onPress={() => navigation.navigate('Permissions')}
        icon="arrow-forward"
        style={styles.fab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '600' },
  subtitle: { marginTop: 8, color: '#666' },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
  },
});
