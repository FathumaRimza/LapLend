import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { deleteLaptop, getLaptops } from '../db/database';
import { COLORS } from '../components/theme';
import { EmptyState, Heading, PrimaryButton, Screen, StatusPill } from '../components/common';

export default function ManageScreen({ navigation }) {
  const [laptops, setLaptops] = useState([]);
  const load = useCallback(() => {
    let active = true;
    getLaptops().then(data => { if (active) setLaptops(data); });
    return () => { active = false; };
  }, []);
  useFocusEffect(load);

  const remove = (item) => Alert.alert('Delete laptop', `Delete ${item.brand} ${item.laptopName}?`, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: async () => {
      try { await deleteLaptop(item.id); setLaptops(await getLaptops()); }
      catch (e) { Alert.alert('Cannot delete', e.message); }
    }}
  ]);

  return (
    <Screen style={{ paddingTop: 20 }}>
      <Heading title="Manage inventory" subtitle="Add, update and remove local laptop records." />
      <View style={styles.banner}>
        <Text style={styles.bannerIcon}>🗂️</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>{laptops.length} registered laptops</Text>
          <Text style={styles.bannerSub}>Changes are saved directly to SQLite.</Text>
        </View>
      </View>
      <PrimaryButton title="+  Add new laptop" onPress={() => navigation.navigate('LaptopForm')} />
      <Text style={styles.section}>ALL LAPTOPS</Text>
      <FlatList
        data={laptops}
        keyExtractor={x => x.id}
        contentContainerStyle={{ paddingBottom: 25 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState title="No inventory yet" message="Add your first laptop to get started." />}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.emoji}><Text style={{ fontSize: 25 }}>{item.imageEmoji || '💻'}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.brand}>{item.brand}</Text>
              <Text style={styles.name}>{item.laptopName}</Text>
              <Text style={styles.serial}>{item.serialNumber} · Rs. {Number(item.pricePerDay).toLocaleString()}/day</Text>
              <View style={{ marginTop: 7 }}><StatusPill status={item.status} /></View>
            </View>
            <View style={styles.itemActions}>
              <Pressable onPress={() => navigation.navigate('LaptopForm', { laptopId: item.id })}><Text style={styles.edit}>Edit</Text></Pressable>
              <Pressable onPress={() => remove(item)}><Text style={styles.delete}>Delete</Text></Pressable>
            </View>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  banner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#EAF0FF', padding: 15, borderRadius: 15, marginBottom: 15 },
  bannerIcon: { fontSize: 26 },
  bannerTitle: { color: COLORS.text, fontWeight: '900', fontSize: 14 },
  bannerSub: { color: COLORS.muted, fontSize: 11, marginTop: 3 },
  section: { color: COLORS.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1.2, marginTop: 22, marginBottom: 11 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, marginBottom: 9 },
  emoji: { width: 48, height: 52, borderRadius: 11, backgroundColor: '#F0F3FF', alignItems: 'center', justifyContent: 'center' },
  brand: { color: COLORS.primary, fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
  name: { color: COLORS.text, fontSize: 13, fontWeight: '900', marginTop: 3 },
  serial: { color: COLORS.muted, fontSize: 9, marginTop: 4 },
  itemActions: { gap: 12, alignItems: 'flex-end' },
  edit: { color: COLORS.primary, fontWeight: '900', fontSize: 11 },
  delete: { color: COLORS.danger, fontWeight: '800', fontSize: 11 }
});
