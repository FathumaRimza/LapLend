import React, { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getRentals, updateRentalStatus } from '../db/database';
import { COLORS } from '../components/theme';
import { EmptyState, Heading, PrimaryButton, Screen, StatusPill } from '../components/common';

export default function RentalsScreen() {
  const [rentals, setRentals] = useState([]);
  const [filter, setFilter] = useState('All');

  const load = useCallback(() => {
    let active = true;
    getRentals().then(data => { if (active) setRentals(data); });
    return () => { active = false; };
  }, []);
  useFocusEffect(load);

  const act = (item, status) => {
    const labels = { approved: 'approve', rejected: 'reject', returned: 'mark as returned' };
    Alert.alert('Confirm action', `Do you want to ${labels[status]} this rental?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: async () => {
        try { await updateRentalStatus(item.id, status); setRentals(await getRentals()); }
        catch (e) { Alert.alert('Error', e.message); }
      }}
    ]);
  };

  const visible = rentals.filter(r => filter === 'All' || r.status === filter.toLowerCase());
  const filters = ['All', 'Pending', 'Approved', 'Returned', 'Rejected'];

  return (
    <Screen style={{ paddingTop: 20 }}>
      <Heading title="Rental records" subtitle="Requests and rental history saved on this device." />
      <View style={styles.filters}>
        {filters.map(f => <Text key={f} onPress={() => setFilter(f)} style={[styles.filter, filter === f && styles.filterActive]}>{f}</Text>)}
      </View>
      <FlatList
        data={visible}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 25 }}
        ListEmptyComponent={<EmptyState icon="📋" title="No rental records" message="Your rental requests will appear here after you request a laptop." />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.brand}>{item.brand}</Text>
                <Text style={styles.name}>{item.laptopName}</Text>
              </View>
              <StatusPill status={item.status} />
            </View>
            <Text style={styles.student}>{item.borrowerName} · {item.borrowerEmail}</Text>
            <View style={styles.dates}>
              <View><Text style={styles.label}>BORROW</Text><Text style={styles.date}>{item.borrowDate}</Text></View>
              <Text style={{ color: COLORS.muted }}>→</Text>
              <View><Text style={styles.label}>RETURN</Text><Text style={styles.date}>{item.returnDate}</Text></View>
            </View>
            <Text style={styles.id}>Request ID: {item.id}</Text>
            {item.status === 'pending' && (
              <View style={styles.actions}>
                <View style={{ flex: 1 }}><PrimaryButton compact title="Approve" onPress={() => act(item, 'approved')} /></View>
                <View style={{ flex: 1 }}><PrimaryButton compact secondary title="Reject" onPress={() => act(item, 'rejected')} /></View>
              </View>
            )}
            {item.status === 'approved' && <PrimaryButton compact secondary title="Mark as returned" onPress={() => act(item, 'returned')} />}
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 14 },
  filter: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: COLORS.border, color: COLORS.muted, paddingHorizontal: 11, paddingVertical: 8, borderRadius: 25, fontSize: 10, fontWeight: '800', overflow: 'hidden' },
  filterActive: { backgroundColor: COLORS.primary, color: '#FFFFFF', borderColor: COLORS.primary },
  card: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, padding: 15, marginBottom: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brand: { color: COLORS.primary, fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  name: { color: COLORS.text, fontSize: 16, fontWeight: '900', marginTop: 4 },
  student: { color: COLORS.muted, fontSize: 11, marginTop: 9 },
  dates: { flexDirection: 'row', alignItems: 'center', gap: 22, paddingVertical: 13, marginTop: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.border },
  label: { color: COLORS.muted, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  date: { color: COLORS.text, fontSize: 12, fontWeight: '800', marginTop: 4 },
  id: { color: '#98A2B3', fontSize: 9, marginTop: 10 },
  actions: { flexDirection: 'row', gap: 9, marginTop: 12 }
});
