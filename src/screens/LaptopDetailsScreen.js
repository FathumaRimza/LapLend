import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getLaptopById } from '../db/database';
import { COLORS, SHADOW } from '../components/theme';
import { Heading, PrimaryButton, Screen, StatusPill } from '../components/common';

export default function LaptopDetailsScreen({ route, navigation }) {
  const { laptopId } = route.params;
  const [laptop, setLaptop] = useState(null);

  useFocusEffect(useCallback(() => {
    let active = true;
    getLaptopById(laptopId).then(item => { if (active) setLaptop(item); });
    return () => { active = false; };
  }, [laptopId]));

  if (!laptop) return <Screen><Text style={{ color: COLORS.muted }}>Loading laptop details...</Text></Screen>;

  return (
    <Screen style={{ paddingTop: 12 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 25 }}>
        <Text onPress={() => navigation.goBack()} style={styles.back}>‹  Back to catalogue</Text>
        <View style={styles.image}><Text style={{ fontSize: 88 }}>{laptop.imageEmoji || '💻'}</Text><Text style={styles.imageLabel}>LAPLEND DEVICE</Text></View>
        <View style={styles.brandRow}><Text style={styles.brand}>{laptop.brand}</Text><StatusPill status={laptop.status} /></View>
        <Text style={styles.name}>{laptop.laptopName}</Text>
        <Text style={styles.serial}>Asset ID: {laptop.id}  ·  {laptop.serialNumber}</Text>
        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>RENTAL RATE</Text>
          <Text style={styles.price}>Rs. {Number(laptop.pricePerDay).toLocaleString()} <Text style={styles.day}>/ day</Text></Text>
        </View>
        <Heading title="Specifications" />
        <View style={styles.infoCard}><Text style={styles.spec}>{laptop.specs || 'Specifications not added.'}</Text></View>
        <Heading title="About this laptop" />
        <View style={styles.infoCard}>
          <Text style={styles.description}>{laptop.description || 'No description available.'}</Text>
          <View style={styles.meta}><Text style={styles.metaLabel}>Category</Text><Text style={styles.metaValue}>{laptop.category}</Text></View>
          <View style={styles.meta}><Text style={styles.metaLabel}>Current status</Text><Text style={styles.metaValue}>{laptop.status}</Text></View>
        </View>
        {laptop.status === 'available' ? (
          <PrimaryButton title="Request this laptop" onPress={() => navigation.navigate('RentLaptop', { laptopId: laptop.id })} />
        ) : (
          <View style={styles.unavailable}><Text style={{ color: COLORS.warning, fontWeight: '700', textAlign: 'center' }}>This laptop is not available for a new rental request.</Text></View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { color: COLORS.primary, fontWeight: '800', fontSize: 13, marginBottom: 15 },
  image: { height: 205, backgroundColor: '#E9EEFF', borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  imageLabel: { color: '#8092D4', fontWeight: '900', fontSize: 9, letterSpacing: 2, marginTop: 8 },
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: COLORS.primary, fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  name: { color: COLORS.text, fontSize: 28, fontWeight: '900', marginTop: 6 },
  serial: { color: COLORS.muted, fontSize: 11, marginTop: 5, marginBottom: 16 },
  priceCard: { backgroundColor: COLORS.navy, borderRadius: 16, padding: 17, marginBottom: 22 },
  priceLabel: { color: '#B9C7EA', fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  price: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', marginTop: 5 },
  day: { color: '#C8D2E9', fontSize: 12, fontWeight: '500' },
  infoCard: { backgroundColor: '#FFFFFF', borderRadius: 15, borderWidth: 1, borderColor: COLORS.border, padding: 16, marginTop: -8, marginBottom: 22, ...SHADOW },
  spec: { color: COLORS.text, fontSize: 14, lineHeight: 22, fontWeight: '700' },
  description: { color: COLORS.muted, fontSize: 13, lineHeight: 21, marginBottom: 14 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 11, borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: 8 },
  metaLabel: { color: COLORS.muted, fontSize: 12 },
  metaValue: { color: COLORS.text, fontSize: 12, fontWeight: '800', textTransform: 'capitalize' },
  unavailable: { backgroundColor: '#FFF5DF', padding: 15, borderRadius: 12 }
});
