import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, SHADOW } from './theme';
import { StatusPill } from './common';

export default function LaptopCard({ laptop, onPress, compact = false }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, compact && styles.compact, pressed && { opacity: 0.86 }]}>
      <View style={styles.imageBox}><Text style={{ fontSize: compact ? 32 : 38 }}>{laptop.imageEmoji || '💻'}</Text></View>
      <View style={styles.info}>
        <View style={styles.topLine}>
          <Text style={styles.brand}>{laptop.brand}</Text>
          <StatusPill status={laptop.status} />
        </View>
        <Text style={styles.name} numberOfLines={1}>{laptop.laptopName}</Text>
        <Text style={styles.specs} numberOfLines={2}>{laptop.specs}</Text>
        <View style={styles.bottom}>
          <Text style={styles.price}>Rs. {Number(laptop.pricePerDay).toLocaleString()} <Text style={styles.perDay}>/ day</Text></Text>
          <Text style={styles.view}>View details →</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: 17, padding: 12, flexDirection: 'row', gap: 13, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border, ...SHADOW },
  compact: { padding: 10 },
  imageBox: { width: 82, minHeight: 92, borderRadius: 13, backgroundColor: '#F0F3FF', alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, justifyContent: 'center' },
  topLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: COLORS.muted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.7 },
  name: { color: COLORS.text, fontWeight: '800', fontSize: 16, marginTop: 5 },
  specs: { color: COLORS.muted, fontSize: 11, lineHeight: 16, marginTop: 4 },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, flexWrap: 'wrap', gap: 4 },
  price: { color: COLORS.primary, fontSize: 13, fontWeight: '800' },
  perDay: { color: COLORS.muted, fontSize: 10, fontWeight: '500' },
  view: { color: COLORS.primary, fontSize: 11, fontWeight: '700' }
});
