import {StatusBar} from 'react-native';
import {AuthProvider} from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fb" />
      <AppNavigator />
    </AuthProvider>
  );
}
