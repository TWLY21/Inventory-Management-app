import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import SectionCard from '../components/SectionCard';
import { useAuth } from '../context/AuthContext';

const roles = ['USER', 'ADMIN'];

export default function RegisterScreen({ navigation }) {
  const { register, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [submitting, setSubmitting] = useState(false);

  async function handleRegister() {
    try {
      setSubmitting(true);
      await register({
        name,
        email,
        password,
        role: user?.role === 'ADMIN' ? role : 'USER',
      });

      if (user?.role === 'ADMIN') {
        Alert.alert('User created', 'The new account has been created successfully.');
        navigation.goBack();
        return;
      }

      Alert.alert('Account created', 'You are now signed in.');
    } catch (error) {
      Alert.alert('Registration failed', error.response?.data?.message || 'Unable to register');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScreenContainer>
      <SectionCard
        title={user?.role === 'ADMIN' ? 'Create New User' : 'Register'}
        subtitle="Use this form to create a staff or admin account."
      >
        <InputField label="Full Name" value={name} onChangeText={setName} placeholder="Jane Doe" />
        <InputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="jane@company.com"
        />
        <InputField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Secure password"
        />

        {user?.role === 'ADMIN' ? (
          <View style={styles.roleRow}>
            {roles.map((item) => (
              <PrimaryButton
                key={item}
                title={item}
                onPress={() => setRole(item)}
                variant={role === item ? 'primary' : 'secondary'}
              />
            ))}
          </View>
        ) : null}

        <PrimaryButton title="Submit" onPress={handleRegister} loading={submitting} />
      </SectionCard>

      {!user ? (
        <Text style={styles.hint} onPress={() => navigation.navigate('Login')}>
          Already have an account? Sign in
        </Text>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  roleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  hint: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#0f172a',
  },
});

