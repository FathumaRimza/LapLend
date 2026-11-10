import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS, SHADOW } from './theme';

export function Screen({ children, style }) {
  return <View style={[styles.screen, style]}>{children}</View>;
}

export function Heading({ title, subtitle, right }) {
  return (
    <View style={styles.headingRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.heading}>{title}</Text>
        {!!subtitle && <Text style={styles.subheading}>{subtitle}</Text>}
      </View>
      {right}
    </View>
  );
}

export function PrimaryButton({ title, onPress, secondary = false, danger = false, disabled = false, compact = false }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [
      styles.button,
      compact && styles.buttonCompact,
      secondary && styles.buttonSecondary,
      danger && styles.buttonDanger,
      disabled && { opacity: 0.45 },
      pressed && !disabled && { opacity: 0.82 }
    ]}>
      <Text style={[styles.buttonText, secondary && styles.buttonSecondaryText, danger && styles.buttonDangerText]}>{title}</Text>
    </Pressable>
  );
}

export function Field({ label, value, onChangeText, placeholder, keyboardType, multiline, autoCapitalize }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || label}
        placeholderTextColor="#9AA5B5"
        keyboardType={keyboardType || 'default'}
        multiline={multiline}
        autoCapitalize={autoCapitalize || 'sentences'}
        style={[styles.input, multiline && { height: 88, textAlignVertical: 'top' }]}
      />
    </View>
  );
}

export function StatusPill({ status }) {
  const map = {
    available: [COLORS.successBg, COLORS.success],
    pending: [COLORS.warningBg, COLORS.warning],
    reserved: [COLORS.warningBg, COLORS.warning],
    approved: ['#E8EEFF', COLORS.primary],
    borrowed: ['#E8EEFF', COLORS.primary],
    returned: [COLORS.successBg, COLORS.success],
    rejected: [COLORS.dangerBg, COLORS.danger],
    cancelled: [COLORS.border, COLORS.muted],
    maintenance: [COLORS.dangerBg, COLORS.danger]
  };
  const [bg, color] = map[status] || [COLORS.border, COLORS.muted];
  return <View style={[styles.pill, { backgroundColor: bg }]}><Text style={[styles.pillText, { color }]}>{status}</Text></View>;
}

export function EmptyState({ icon = '📭', title, message }) {
  return <View style={styles.empty}><Text style={{ fontSize: 34 }}>{icon}</Text><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.emptyText}>{message}</Text></View>;
}

export function Loading() {
  return <View style={{ padding: 30 }}><ActivityIndicator color={COLORS.primary} /></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 18, paddingTop: 16 },
  headingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, gap: 10 },
  heading: { fontSize: 25, fontWeight: '800', color: COLORS.text, letterSpacing: -0.5 },
  subheading: { fontSize: 13, color: COLORS.muted, marginTop: 4 },
  button: { backgroundColor: COLORS.primary, borderRadius: 13, paddingVertical: 14, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  buttonCompact: { paddingVertical: 9, paddingHorizontal: 12, borderRadius: 10 },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  buttonSecondary: { backgroundColor: '#EEF2FF' },
  buttonSecondaryText: { color: COLORS.primary },
  buttonDanger: { backgroundColor: COLORS.dangerBg },
  buttonDangerText: { color: COLORS.danger },
  fieldWrap: { marginBottom: 14 },
  fieldLabel: { color: COLORS.text, fontWeight: '700', fontSize: 13, marginBottom: 7 },
  input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 13, paddingVertical: 12, fontSize: 14, color: COLORS.text },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 30 },
  pillText: { fontSize: 11, fontWeight: '800', textTransform: 'capitalize' },
  empty: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  emptyTitle: { color: COLORS.text, fontSize: 16, fontWeight: '800', marginTop: 10 },
  emptyText: { color: COLORS.muted, fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 19 }
});
