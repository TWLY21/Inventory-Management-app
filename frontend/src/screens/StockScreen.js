import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import EmptyState from '../components/EmptyState';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import SectionCard from '../components/SectionCard';
import { productApi, stockApi } from '../services/api';

export default function StockScreen() {
  const isFocused = useIsFocused();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await productApi.getAll();
        setProducts(response.data);
      } catch (error) {
        Alert.alert('Unable to load stock data', error.response?.data?.message || 'Try again later');
      }
    }

    if (isFocused) {
      loadProducts();
    }
  }, [isFocused]);

  async function handleStockAction(type) {
    if (!selectedProduct) {
      Alert.alert('Select a product', 'Choose a product before updating stock.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        productId: selectedProduct.id,
        quantity: Number(quantity),
      };

      if (type === 'IN') {
        await stockApi.stockIn(payload);
      } else {
        await stockApi.stockOut(payload);
      }

      const refreshedProducts = await productApi.getAll();
      const nextProducts = refreshedProducts.data;
      const nextSelection = nextProducts.find((item) => item.id === selectedProduct.id) || null;

      setProducts(nextProducts);
      setSelectedProduct(nextSelection);
      setQuantity('');

      Alert.alert('Success', type === 'IN' ? 'Stock added.' : 'Stock removed.');
    } catch (error) {
      Alert.alert('Unable to update stock', error.response?.data?.message || 'Try again later');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScreenContainer>
      <SectionCard
        title="Stock Management"
        subtitle="Select a product and record stock moving in or out of inventory."
      >
        {selectedProduct ? (
          <View style={styles.selectedBox}>
            <Text style={styles.selectedTitle}>{selectedProduct.name}</Text>
            <Text style={styles.selectedMeta}>Current quantity: {selectedProduct.quantity}</Text>
          </View>
        ) : (
          <EmptyState
            title="No product selected"
            subtitle="Pick a product below before submitting a stock movement."
          />
        )}

        <InputField
          label="Movement Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          placeholder="Enter quantity"
        />

        <PrimaryButton title="Stock In" onPress={() => handleStockAction('IN')} loading={submitting} />
        <PrimaryButton
          title="Stock Out"
          variant="secondary"
          onPress={() => handleStockAction('OUT')}
          loading={submitting}
        />
      </SectionCard>

      <SectionCard title="Products">
        {products.length === 0 ? (
          <EmptyState title="No products found" subtitle="Products will appear here once they are created." />
        ) : (
          products.map((product) => (
            <Pressable
              key={product.id}
              style={[
                styles.productRow,
                selectedProduct?.id === product.id ? styles.productRowActive : null,
              ]}
              onPress={() => setSelectedProduct(product)}
            >
              <View>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productMeta}>Quantity: {product.quantity}</Text>
              </View>
              <Text style={styles.productMeta}>${Number(product.price).toFixed(2)}</Text>
            </Pressable>
          ))
        )}
      </SectionCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  selectedBox: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#ecfeff',
    borderWidth: 1,
    borderColor: '#a5f3fc',
    gap: 4,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  selectedMeta: {
    color: '#155e75',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  productRowActive: {
    borderColor: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  productName: {
    fontWeight: '700',
    color: '#0f172a',
  },
  productMeta: {
    color: '#64748b',
  },
});
