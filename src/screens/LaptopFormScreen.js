import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getLaptopById, saveLaptop } from '../db/database';
import { COLORS } from '../components/theme';
import { Field, Heading, PrimaryButton, Screen } from '../components/common';

const empty = { laptopName: '', brand: '', serialNumber: '', specs: '', category: 'Student', pricePerDay: '1000', status: 'available', description: '' };

export default function LaptopFormScreen({ route, navigation }) {
  const laptopId = route.params?.laptopId;
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (laptopId) getLaptopById(laptopId).then(item => {
      if (item) setForm({ ...item, pricePerDay: String(item.pricePerDay) });
    });
  }, [laptopId]);

  const update = (key, value) => setForm(old => ({ ...old, [key]: value }));

  const submit = async () => {
    if (!form.laptopName.trim() || !form.brand.trim() || !form.serialNumber.trim() || !form.pricePerDay.trim()) {
      Alert.alert('Required fields', 'Enter the laptop name, brand, serial number and daily rental price.');
      return;
    }
    if (!Number.isFinite(Number(form.pricePerDay)) || Number(form.pricePerDay) < 0) {
      Alert.alert('Invalid price', 'Enter a valid daily rental price.');
      return;
    }
    setSaving(true);
    try {
      await saveLaptop({ ...form, id: laptopId });
      Alert.alert('Saved', 'Laptop information has been saved locally.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (e) {
      Alert.alert('Could not save', e.message.includes('UNIQUE') ? 'That serial number is already registered.' : e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen style={{ paddingTop: 12 }}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <Text onPress={() => navigation.goBack()} style={styles.back}>‹  Back to inventory</Text>
        <Heading title={laptopId ? 'Edit laptop' : 'Add a laptop'} subtitle="Laptop details are stored in the local database." />
        <Field label="Laptop name / model *" value={form.laptopName} onChangeText={v => update('laptopName', v)} placeholder="e.g. Latitude 5420" />
        <Field label="Brand *" value={form.brand} onChangeText={v => update('brand', v)} placeholder="e.g. Dell" />
        <Field label="Serial number / asset tag *" value={form.serialNumber} onChangeText={v => update('serialNumber', v)} placeholder="e.g. UV-LAP-013" autoCapitalize="characters" />
        <Field label="Specifications" value={form.specs} onChangeText={v => update('specs', v)} placeholder="Processor, RAM, storage..." multiline />
        <Field label="Category" value={form.category} onChangeText={v => update('category', v)} placeholder="Business / Student / Premium" />
        <Field label="Rental price per day (LKR) *" value={form.pricePerDay} onChangeText={v => update('pricePerDay', v)} keyboardType="numeric" />
        <Field label="Description" value={form.description || ''} onChangeText={v => update('description', v)} placeholder="Short description..." multiline />
        <Text style={styles.hint}>New laptops are added as Available. Use the inventory list to edit the details later.</Text>
        <PrimaryButton title={saving ? 'Saving...' : 'Save laptop'} onPress={submit} disabled={saving} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { color: COLORS.primary, fontWeight: '800', fontSize: 13, marginBottom: 15 },
  hint: { color: COLORS.muted, fontSize: 11, lineHeight: 17, marginBottom: 15 }
});
