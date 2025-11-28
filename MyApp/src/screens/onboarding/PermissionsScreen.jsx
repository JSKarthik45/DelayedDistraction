import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CircleButton from '../../components/CircleButton';
import { OnboardingContext } from '../../navigation/OnboardingContext';

export default function PermissionsScreen() {
  const { completeOnboarding } = useContext(OnboardingContext);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Permissions</Text>
      <Text style={styles.subtitle}>Explain required app permissions here.</Text>

      <CircleButton
        onPress={completeOnboarding}
        icon="checkmark"
        backgroundColor="#22c55e"
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
