import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';

import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import SectionCard from '../components/SectionCard';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin@123');
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin() {
    try {
      setSubmitting(true);
      await login({ email, password });
    } catch (error) {
      Alert.alert('Login failed', error.response?.data?.message || 'Unable to sign in');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScreenContainer contentStyle={styles.container}>
      <SectionCard
        title="Inventory Management"
        subtitle="Sign in to manage products, stock movements, and team access."
      >
        <InputField label="Email" value={email} onChangeText={setEmail} placeholder="Email" />
        <InputField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
        />
        <PrimaryButton title="Sign In" onPress={handleLogin} loading={submitting} />
      </SectionCard>

      <Pressable onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Need an account? Register here</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  link: {
    textAlign: 'center',
    color: '#0f172a',
    fontWeight: '600',
  },
});

