import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import SectionCard from '../components/SectionCard';
import { useAuth } from '../context/AuthContext';
import { productApi, userApi } from '../services/api';

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useAuth();
  const isFocused = useIsFocused();
  const [summary, setSummary] = useState({ products: 0, users: 0 });

  useEffect(() => {
    async function loadSummary() {
      try {
        const [productsResponse, usersResponse] = await Promise.all([
          productApi.getAll(),
          user?.role === 'ADMIN' ? userApi.getAll() : Promise.resolve({ data: [] }),
        ]);

        setSummary({
          products: productsResponse.data.length,
          users: usersResponse.data.length,
        });
      } catch (error) {
        Alert.alert('Unable to load dashboard', error.response?.data?.message || 'Try again later');
      }
    }

    if (isFocused) {
      loadSummary();
    }
  }, [isFocused, user?.role]);

  async function handleLogout() {
    await logout();
  }

  return (
    <ScreenContainer>
      <SectionCard
        title={`Welcome, ${user?.name}`}
        subtitle={`Signed in as ${user?.role}. Use the modules below to manage inventory operations.`}
      >
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{summary.products}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{user?.role === 'ADMIN' ? summary.users : '--'}</Text>
            <Text style={styles.statLabel}>Users</Text>
          </View>
        </View>
      </SectionCard>

      <SectionCard title="Modules">
        <PrimaryButton title="View Products" onPress={() => navigation.navigate('Products')} />
        <PrimaryButton
          title="Stock Management"
          variant="secondary"
          onPress={() => navigation.navigate('Stock')}
        />
        {user?.role === 'ADMIN' ? (
          <PrimaryButton
            title="Create User"
            variant="secondary"
            onPress={() => navigation.navigate('Register')}
          />
        ) : null}
        <PrimaryButton title="Logout" variant="secondary" onPress={handleLogout} />
      </SectionCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 4,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0f172a',
  },
  statLabel: {
    color: '#64748b',
  },
});

