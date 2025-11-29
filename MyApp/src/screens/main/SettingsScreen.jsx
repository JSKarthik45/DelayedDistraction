import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, FlatList, Pressable, TextInput, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme';
import { loadPreferences, savePreferences } from '../../storage/preferences';

const SOCIAL_APPS = [
  { key: 'instagram', label: 'Instagram', icon: 'logo-instagram' },
  { key: 'facebook', label: 'Facebook', icon: 'logo-facebook' },
  { key: 'twitter', label: 'Twitter / X', icon: 'logo-twitter' },
  { key: 'tiktok', label: 'TikTok', icon: 'logo-tiktok' },
  { key: 'youtube', label: 'YouTube', icon: 'logo-youtube' },
  { key: 'snapchat', label: 'Snapchat', icon: 'logo-snapchat' },
];

export default function SettingsScreen() {
  const [blocked, setBlocked] = useState({});
  const [problemTarget, setProblemTarget] = useState(5);
  const [chessUsername, setChessUsername] = useState('');

  // Load saved preferences on mount
  useEffect(() => {
    (async () => {
      const pref = await loadPreferences();
      setBlocked(pref.blocked || {});
      setProblemTarget(pref.problemTarget ?? 5);
    })();
  }, []);

  const toggleApp = (key) => {
    setBlocked(prev => {
      const next = { ...prev, [key]: !prev[key] };
      savePreferences({ blocked: next, problemTarget });
      return next;
    });
  };

  const renderItem = ({ item }) => {
    const isOn = !!blocked[item.key];
    return (
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Ionicons name={item.icon} size={24} color={lightTheme.colors.text} />
          <Text style={styles.rowLabel}>{item.label}</Text>
        </View>
        <Switch
          value={isOn}
          onValueChange={() => toggleApp(item.key)}
          trackColor={{ false: lightTheme.colors.border, true: lightTheme.colors.primary }}
          thumbColor={isOn ? lightTheme.colors.text : '#f4f3f4'}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.sectionTitle}>Select social media apps to block</Text>
      <FlatList
        data={SOCIAL_APPS}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
      />

      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Select number of problems to solve</Text>
      <View style={styles.pillRow}>
        {[1, 3, 5, 10, 20].map(n => {
          const active = problemTarget === n;
          return (
            <Pressable key={n} onPress={() => { setProblemTarget(n); savePreferences({ blocked, problemTarget: n }); }} style={[styles.pill, active && styles.pillActive]}>
              <Text style={[styles.pillText, active && styles.pillTextActive]}>{n}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.helperText}>You must solve {problemTarget} problem(s) to unblock selected apps.</Text>

      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Import rating from Chess.com</Text>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Chess.com Username</Text>
        <TextInput
          value={chessUsername}
          onChangeText={setChessUsername}
          placeholder="e.g., johndoe"
          style={styles.input}
          placeholderTextColor={lightTheme.colors.muted}
        />
        <Pressable style={[styles.primaryBtn, { opacity: chessUsername ? 1 : 0.6 }]} disabled={!chessUsername}>
          <Text style={styles.primaryBtnText}>Import</Text>
        </Pressable>
        <Text style={styles.helperText}>UI only; no data is fetched yet.</Text>
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Our other products and services</Text>
      <View style={styles.linkList}>
        <Pressable style={styles.linkRow} onPress={() => Linking.openURL('https://www.clutchess.tech')}>
          <Ionicons name="planet" size={22} color={lightTheme.colors.text} />
          <Text style={styles.linkLabel}>Clutch Chess</Text>
          <Ionicons name="open-outline" size={20} color={lightTheme.colors.muted} style={styles.linkIconRight} />
        </Pressable>
        <Pressable style={styles.linkRow} onPress={() => Linking.openURL('https://www.velacherychessacademy.com')}>
          <Ionicons name="school" size={22} color={lightTheme.colors.text} />
          <Text style={styles.linkLabel}>Velachery Chess Academy</Text>
          <Ionicons name="open-outline" size={20} color={lightTheme.colors.muted} style={styles.linkIconRight} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  scrollContent: { paddingBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, color: lightTheme.colors.text },
  listContent: { paddingVertical: 3 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: lightTheme.colors.border,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowLabel: { marginLeft: 12, fontSize: 16, color: lightTheme.colors.text },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap' },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: lightTheme.colors.border,
    marginRight: 8,
    marginBottom: 8,
  },
  pillActive: { backgroundColor: lightTheme.colors.primary, borderColor: lightTheme.colors.primary },
  pillText: { color: lightTheme.colors.text },
  pillTextActive: { color: '#fff', fontWeight: '600' },
  helperText: { marginTop: 6, color: lightTheme.colors.muted },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: lightTheme.colors.border,
    borderRadius: 12,
    padding: 12,
    backgroundColor: lightTheme.colors.surface,
  },
  cardLabel: { marginBottom: 6, color: lightTheme.colors.text, fontWeight: '600' },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: lightTheme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: lightTheme.colors.text,
    marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: lightTheme.colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  linkList: { marginTop: 4 },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: lightTheme.colors.border,
  },
  linkLabel: { marginLeft: 12, fontSize: 16, color: lightTheme.colors.text, flex: 1 },
  linkIconRight: { marginLeft: 8 },
});
