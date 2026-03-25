import { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import EmptyState from '../components/EmptyState';
import PrimaryButton from '../components/PrimaryButton';
import ProductCard from '../components/ProductCard';
import ScreenContainer from '../components/ScreenContainer';
import SectionCard from '../components/SectionCard';
import { useAuth } from '../context/AuthContext';
import { productApi } from '../services/api';

export default function ProductListScreen({ navigation }) {
  const { user } = useAuth();
  const isFocused = useIsFocused();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await productApi.getAll();
        setProducts(response.data);
      } catch (error) {
        Alert.alert('Unable to load products', error.response?.data?.message || 'Try again later');
      }
    }

    if (isFocused) {
      loadProducts();
    }
  }, [isFocused]);

  return (
    <ScreenContainer scroll={false}>
      <SectionCard
        title="Products"
        subtitle="Browse the current inventory list and open an item to inspect or edit it."
      >
        {user?.role === 'ADMIN' ? (
          <PrimaryButton
            title="Create Product"
            onPress={() => navigation.navigate('ProductDetail', { mode: 'create' })}
          />
        ) : null}
      </SectionCard>

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 20, paddingTop: 0, gap: 12 }}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          />
        )}
        ListEmptyComponent={
          <EmptyState title="No products yet" subtitle="Create the first product to populate inventory." />
        }
      />
    </ScreenContainer>
  );
}

