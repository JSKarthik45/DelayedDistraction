import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../theme/ThemeContext';

export const SOCIAL_APPS = [
  { key: 'instagram', label: 'Instagram', icon: 'logo-instagram' },
  { key: 'facebook', label: 'Facebook', icon: 'logo-facebook' },
  { key: 'twitter', label: 'Twitter / X', icon: 'logo-twitter' },
  { key: 'tiktok', label: 'TikTok', icon: 'logo-tiktok' },
  { key: 'youtube', label: 'YouTube', icon: 'logo-youtube' },
  { key: 'snapchat', label: 'Snapchat', icon: 'logo-snapchat' },
];

const styleFactory = (colors) => StyleSheet.create({
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, color: colors.text },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowLabel: { marginLeft: 12, fontSize: 16, color: colors.text },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap' },
  pill: {
    paddingVertical: 3,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    marginRight: 8,
    marginBottom: 8,
  },
  pillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { color: colors.text },
  pillTextActive: { color: '#fff', fontWeight: '600' },
  helperText: { marginTop: 1, color: colors.muted },
});

export default function SettingsQuickSetup({ blocked, setBlocked, problemTarget, setProblemTarget }) {
  const colors = useThemeColors();
  const styles = useThemedStyles(styleFactory);
  const toggleApp = (key) => setBlocked(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <View>
      <Text style={styles.sectionTitle}>Select social media apps to block</Text>
      {SOCIAL_APPS.map(item => {
        const isOn = !!blocked[item.key];
        return (
          <View key={item.key} style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name={item.icon} size={24} color={colors.text} />
              <Text style={styles.rowLabel}>{item.label}</Text>
            </View>
            <Switch
              value={isOn}
              onValueChange={() => toggleApp(item.key)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={isOn ? colors.text : '#f4f3f4'}
            />
          </View>
        );
      })}

      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Select number of problems to solve</Text>
      <View style={styles.pillRow}>
        {[1, 3, 5, 10, 20].map(n => {
          const active = problemTarget === n;
          return (
            <Pressable key={n} onPress={() => setProblemTarget(n)} style={[styles.pill, active && styles.pillActive]}>
              <Text style={[styles.pillText, active && styles.pillTextActive]}>{n}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.helperText}>You must solve {problemTarget} problem(s) to unblock selected apps.</Text>
    </View>
  );
}
