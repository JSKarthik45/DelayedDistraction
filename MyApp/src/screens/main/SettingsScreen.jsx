import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, FlatList, Pressable, TextInput, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemedStyles, useThemeColors } from '../../theme/ThemeContext';
import { loadPreferences, savePreferences, setTheme } from '../../storage/preferences';
import { useThemeController } from '../../theme/ThemeContext';

const SOCIAL_APPS = [
  { key: 'instagram', label: 'Instagram', icon: 'logo-instagram' },
  { key: 'facebook', label: 'Facebook', icon: 'logo-facebook' },
  { key: 'twitter', label: 'Twitter / X', icon: 'logo-twitter' },
  { key: 'tiktok', label: 'TikTok', icon: 'logo-tiktok' },
  { key: 'youtube', label: 'YouTube', icon: 'logo-youtube' },
  { key: 'snapchat', label: 'Snapchat', icon: 'logo-snapchat' },
];

const styleFactory = (colors) => StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  scrollContent: { paddingBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, color: colors.secondary },
  listContent: { paddingVertical: 3 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowLabel: { marginLeft: 12, fontSize: 16, color: colors.text },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap' },
  pill: {
    paddingVertical: 8,
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
  helperText: { marginTop: 6, color: colors.muted },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.surface,
  },
  cardLabel: { marginBottom: 6, color: colors.text, fontWeight: '600' },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: colors.text,
    marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  primaryBtnText: { color: colors.text, fontWeight: '700' },
  linkList: { marginTop: 4 },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  linkLabel: { marginLeft: 12, fontSize: 16, color: colors.text, flex: 1 },
  linkIconRight: { marginLeft: 8 },
  themeRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    width: '48%',
    marginRight: 0,
    marginBottom: 10,
    backgroundColor: colors.surface,
  },
  themeOptionActive: { borderColor: colors.primary },
  themeSwatches: { flexDirection: 'row', marginRight: 8 },
  swatch: { width: 18, height: 18, borderRadius: 4, marginRight: 4 },
  themeLabel: { color: colors.text, fontSize: 14, fontWeight: '600' },
});

export default function SettingsScreen() {
  const [blocked, setBlocked] = useState({});
  const [problemTarget, setProblemTarget] = useState(5);
  const [chessUsername, setChessUsername] = useState('');
  const [themeKey, setThemeKey] = useState('classic');
  const themeController = useThemeController();
  const colors = useThemeColors();
  const styles = useThemedStyles(styleFactory);

  // Load saved preferences on mount
  useEffect(() => {
    (async () => {
      const pref = await loadPreferences();
      setBlocked(pref.blocked || {});
      setProblemTarget(pref.problemTarget ?? 5);
      if (pref.theme) {
        setThemeKey(pref.theme.key || 'classic');
      }
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
  };

  const themeOptions = [
    { key: 'classic', label: 'Green', primary: '#739552', secondary: '#ebecd0' },
    { key: 'warm', label: 'Brown', primary: '#b88762', secondary: '#edd6b0' },
    { key: 'blue', label: 'Blue', primary: '#4b7399', secondary: '#eff5faff' },
    { key: 'rose', label: 'Pink', primary: '#ec94a4', secondary: '#f3dde2ff' },
  ];

  const applyTheme = (opt) => {
    setThemeKey(opt.key);
    themeController.applyTheme(opt);
    setTheme({ key: opt.key, primary: opt.primary, secondary: opt.secondary });
    savePreferences({ blocked, problemTarget, theme: { key: opt.key, primary: opt.primary, secondary: opt.secondary } });
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
          placeholderTextColor={colors.muted}
        />
        <Pressable style={[styles.primaryBtn, { opacity: chessUsername ? 1 : 0.6 }]} disabled={!chessUsername}>
          <Text style={styles.primaryBtnText}>Import</Text>
        </Pressable>
        <Text style={styles.helperText}>UI only; no data is fetched yet.</Text>
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Theme</Text>
      <View style={styles.themeRow}>
        {themeOptions.map(opt => {
          const active = themeKey === opt.key;
          return (
            <Pressable key={opt.key} onPress={() => applyTheme(opt)} style={[styles.themeOption, active && styles.themeOptionActive]}> 
              <View style={styles.themeSwatches}>
                <View style={[styles.swatch, { backgroundColor: opt.primary }]} />
                <View style={[styles.swatch, { backgroundColor: opt.secondary }]} />
              </View>
              <Text style={styles.themeLabel}>{opt.label}</Text>
              {active && <Ionicons name="checkmark-circle" size={20} color={colors.primary} style={{ marginLeft: 6 }} />}
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Our other products and services</Text>
      <View style={styles.linkList}>
        <Pressable style={styles.linkRow} onPress={() => Linking.openURL('https://www.clutchess.tech')}>
          <Ionicons name="planet" size={22} color={colors.text} />
          <Text style={styles.linkLabel}>Clutch Chess</Text>
          <Ionicons name="open-outline" size={20} color={colors.muted} style={styles.linkIconRight} />
        </Pressable>
        <Pressable style={styles.linkRow} onPress={() => Linking.openURL('https://www.velacherychessacademy.com')}>
          <Ionicons name="school" size={22} color={colors.text} />
          <Text style={styles.linkLabel}>Velachery Chess Academy</Text>
          <Ionicons name="open-outline" size={20} color={colors.muted} style={styles.linkIconRight} />
        </Pressable>
      </View>

    </ScrollView>
  );
}

// Removed outdated static styles block; dynamic styles generated via styleFactory + useThemedStyles.
