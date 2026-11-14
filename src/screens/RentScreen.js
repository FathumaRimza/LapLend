import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getLaptopById, createRental } from '../db/database';
import { COLORS } from '../components/theme';
import { Field, Heading, PrimaryButton, Screen } from '../components/common';

function dateAfter(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function RentScreen({ route, navigation }) {
  const { laptopId } = route.params;
  const [laptop, setLaptop] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [borrowDate, setBorrowDate] = useState(dateAfter(0));
  const [returnDate, setReturnDate] = useState(dateAfter(3));
  const [saving, setSaving] = useState(false);

  useEffect(() => { getLaptopById(laptopId).then(setLaptop); }, [laptopId]);

  const submit = async () => {
    if (!name.trim() || !email.trim() || !borrowDate.trim() || !returnDate.trim()) {
      Alert.alert('Missing details', 'Please complete all fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(borrowDate) || !/^\d{4}-\d{2}-\d{2}$/.test(returnDate) || returnDate <= borrowDate) {
      Alert.alert('Invalid dates', 'Use YYYY-MM-DD. The return date must be after the borrow date.');
      return;
    }
    setSaving(true);
    try {
      await createRental({ laptopId, borrowerName: name.trim(), borrowerEmail: email.trim(), borrowDate, returnDate });
      Alert.alert('Request saved', 'Your rental request has been saved on this device.', [
        { text: 'View my rentals', onPress: () => navigation.navigate('MainTabs', { screen: 'Rentals' }) }
      ]);
    } catch (e) {
      Alert.alert('Could not create request', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen style={{ paddingTop: 12 }}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <Text onPress={() => navigation.goBack()} style={styles.back}>‹  Back to details</Text>
        <Heading title="Request a rental" subtitle="Enter your details to save a local rental request." />
        {laptop && (
          <View style={styles.summary}>
            <Text style={{ fontSize: 28 }}>{laptop.imageEmoji || '💻'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryBrand}>{laptop.brand}</Text>
              <Text style={styles.summaryName}>{laptop.laptopName}</Text>
              <Text style={styles.summaryPrice}>Rs. {Number(laptop.pricePerDay).toLocaleString()} / day</Text>
            </View>
          </View>
        )}
        <Text style={styles.section}>STUDENT INFORMATION</Text>
        <Field label="Full name" value={name} onChangeText={setName} placeholder="Enter your full name" />
        <Field label="Email address" value={email} onChangeText={setEmail} placeholder="student@example.com" keyboardType="email-address" autoCapitalize="none" />
        <Text style={styles.section}>RENTAL PERIOD</Text>
        <Field label="Borrow date (YYYY-MM-DD)" value={borrowDate} onChangeText={setBorrowDate} placeholder="2026-11-05" />
        <Field label="Return date (YYYY-MM-DD)" value={returnDate} onChangeText={setReturnDate} placeholder="2026-11-08" />
        <View style={styles.note}><Text style={styles.noteText}>ⓘ  This request is stored locally and starts with Pending status. No internet connection is required.</Text></View>
        <PrimaryButton title={saving ? 'Saving...' : 'Submit rental request'} onPress={submit} disabled={saving || !laptop} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { color: COLORS.primary, fontWeight: '800', fontSize: 13, marginBottom: 15 },
  summary: { backgroundColor: '#FFFFFF', borderRadius: 15, borderWidth: 1, borderColor: COLORS.border, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: 22 },
  summaryBrand: { color: COLORS.muted, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  summaryName: { color: COLORS.text, fontSize: 15, fontWeight: '900', marginTop: 3 },
  summaryPrice: { color: COLORS.primary, fontSize: 12, fontWeight: '800', marginTop: 4 },
  section: { color: COLORS.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.2, marginBottom: 12, marginTop: 4 },
  note: { backgroundColor: '#EEF2FF', padding: 13, borderRadius: 12, marginBottom: 17 },
  noteText: { color: COLORS.primaryDark, fontSize: 11, lineHeight: 17 }
});
