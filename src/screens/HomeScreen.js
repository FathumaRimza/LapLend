import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getDashboardStats, getLaptops } from '../db/database';
import { COLORS, SHADOW } from '../components/theme';
import { Heading, Screen } from '../components/common';
import LaptopCard from '../components/LaptopCard';

export default function HomeScreen({ navigation }) {
  const [stats, setStats] = useState({ laptops: 0, available: 0, active: 0, returned: 0 });
  const [featured, setFeatured] = useState([]);

  useFocusEffect(useCallback(() => {
    let active = true;
    (async () => {
      const [s, laptops] = await Promise.all([getDashboardStats(), getLaptops()]);
      if (active) {
        setStats(s);
        setFeatured(laptops.filter(x => x.status === 'available').slice(0, 3));
      }
    })();
    return () => { active = false; };
  }, []));

  const tiles = [
    { label: 'Total laptops', value: stats.laptops, emoji: '💻' },
    { label: 'Available', value: stats.available, emoji: '✅' },
    { label: 'Active rentals', value: stats.active, emoji: '📦' },
    { label: 'Returned', value: stats.returned, emoji: '↩️' }
  ];

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.top}>
          <View>
            <Text style={styles.eyebrow}>UNIVERSITY LAPTOP LIBRARY</Text>
            <Text style={styles.title}>Hello, Student 👋</Text>
            <Text style={styles.sub}>Your campus laptop rental companion</Text>
          </View>
          <View style={styles.logo}><Text style={{ fontSize: 25 }}>⌘</Text></View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroSmall}>STUDY SMARTER WITH</Text>
          <Text style={styles.heroTitle}>The right laptop{'\n'}for your next task.</Text>
          <Text style={styles.heroSub}>Browse devices and request a rental — even offline.</Text>
          <Pressable style={styles.heroButton} onPress={() => navigation.navigate('Browse')}>
            <Text style={styles.heroButtonText}>Explore laptops  →</Text>
          </Pressable>
          <Text style={styles.heroEmoji}>💻</Text>
        </View>

        <Heading title="Library overview" subtitle="A quick look at your local inventory" />
        <View style={styles.grid}>
          {tiles.map((tile) => (
            <View key={tile.label} style={styles.stat}>
              <Text style={styles.statEmoji}>{tile.emoji}</Text>
              <Text style={styles.statValue}>{tile.value}</Text>
              <Text style={styles.statLabel}>{tile.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 24 }}>
          <Heading title="Available laptops" subtitle="Ready for a new rental" right={
            <Pressable onPress={() => navigation.navigate('Browse')}><Text style={styles.seeAll}>See all →</Text></Pressable>
          } />
          {featured.map(laptop => <LaptopCard key={laptop.id} laptop={laptop} compact onPress={() => navigation.navigate('LaptopDetails', { laptopId: laptop.id })} />)}
        </View>
        <View style={styles.offline}><Text style={{ fontSize: 17 }}>📴</Text><Text style={styles.offlineText}>Offline ready · Your data is stored on this device</Text></View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  eyebrow: { fontSize: 9, color: COLORS.primary, fontWeight: '900', letterSpacing: 1.3 },
  title: { color: COLORS.text, fontSize: 25, fontWeight: '900', marginTop: 5 },
  sub: { color: COLORS.muted, fontSize: 12, marginTop: 4 },
  logo: { width: 47, height: 47, borderRadius: 15, backgroundColor: '#E8EEFF', alignItems: 'center', justifyContent: 'center' },
  hero: { backgroundColor: COLORS.navy, borderRadius: 22, padding: 21, marginBottom: 24, overflow: 'hidden', minHeight: 205 },
  heroSmall: { color: '#B7C7FF', fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  heroTitle: { color: '#FFFFFF', fontSize: 25, fontWeight: '900', marginTop: 9, lineHeight: 30 },
  heroSub: { color: '#D2DAEA', fontSize: 11, marginTop: 8, maxWidth: '75%', lineHeight: 17 },
  heroButton: { backgroundColor: '#FFFFFF', borderRadius: 10, alignSelf: 'flex-start', paddingHorizontal: 13, paddingVertical: 10, marginTop: 15 },
  heroButtonText: { color: COLORS.navy, fontWeight: '800', fontSize: 11 },
  heroEmoji: { position: 'absolute', right: 9, bottom: 22, fontSize: 76, opacity: 0.25 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  stat: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: COLORS.border, ...SHADOW },
  statEmoji: { fontSize: 18 },
  statValue: { color: COLORS.text, fontSize: 25, fontWeight: '900', marginTop: 7 },
  statLabel: { color: COLORS.muted, fontSize: 11, marginTop: 2 },
  seeAll: { color: COLORS.primary, fontSize: 12, fontWeight: '800' },
  offline: { marginTop: 16, padding: 13, backgroundColor: '#EAF7F1', borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 9 },
  offlineText: { color: COLORS.success, fontSize: 11, fontWeight: '700' }
});
