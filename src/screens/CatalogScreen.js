import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getLaptops } from '../db/database';
import { COLORS } from '../components/theme';
import { Heading, Screen, EmptyState } from '../components/common';
import LaptopCard from '../components/LaptopCard';

const FILTERS = ['All', 'Available', 'Business', 'Student', 'Premium', 'Performance'];

export default function CatalogScreen({ navigation }) {
  const [laptops, setLaptops] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const load = useCallback(() => {
    let mounted = true;
    getLaptops().then(data => { if (mounted) setLaptops(data); });
    return () => { mounted = false; };
  }, []);
  useFocusEffect(load);

  const filtered = useMemo(() => laptops.filter(laptop => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || [laptop.laptopName, laptop.brand, laptop.specs, laptop.serialNumber].some(v => (v || '').toLowerCase().includes(q));
    const matchesFilter = filter === 'All' ||
      (filter === 'Available' ? laptop.status === 'available' : laptop.category === filter);
    return matchesSearch && matchesFilter;
  }), [laptops, search, filter]);

  return (
    <Screen style={{ paddingTop: 20 }}>
      <Heading title="Laptop catalogue" subtitle={`${laptops.length} devices in your local library`} />
      <View style={styles.search}>
        <Text style={{ fontSize: 17 }}>⌕</Text>
        <TextInput value={search} onChangeText={setSearch} placeholder="Search brand, model or specs..." placeholderTextColor="#9AA5B5" style={styles.searchInput} />
        {!!search && <Pressable onPress={() => setSearch('')}><Text style={{ color: COLORS.muted }}>✕</Text></Pressable>}
      </View>
      <View style={{ marginBottom: 12 }}>
        <FlatList horizontal showsHorizontalScrollIndicator={false} data={FILTERS} keyExtractor={x => x}
          renderItem={({ item }) => (
            <Pressable onPress={() => setFilter(item)} style={[styles.chip, filter === item && styles.chipActive]}>
              <Text style={[styles.chipText, filter === item && styles.chipTextActive]}>{item}</Text>
            </Pressable>
          )} />
      </View>
      <Text style={styles.result}>{filtered.length} result{filtered.length === 1 ? '' : 's'}</Text>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <LaptopCard laptop={item} onPress={() => navigation.navigate('LaptopDetails', { laptopId: item.id })} />}
        ListEmptyComponent={<EmptyState icon="🔎" title="No laptops found" message="Try another search term or select a different filter." />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 25 }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: COLORS.border, borderRadius: 13, paddingHorizontal: 13, marginBottom: 13, gap: 9 },
  searchInput: { flex: 1, paddingVertical: 13, fontSize: 13, color: COLORS.text },
  chip: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 30, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: COLORS.border, marginRight: 7 },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 11, color: COLORS.muted, fontWeight: '700' },
  chipTextActive: { color: '#FFFFFF' },
  result: { fontSize: 11, color: COLORS.muted, marginBottom: 10, fontWeight: '700' }
});
