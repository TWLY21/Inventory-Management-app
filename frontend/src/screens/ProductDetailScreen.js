import { useState } from 'react';
import { Alert } from 'react-native';

import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import ScreenContainer from '../components/ScreenContainer';
import SectionCard from '../components/SectionCard';
import { useAuth } from '../context/AuthContext';
import { productApi } from '../services/api';

export default function ProductDetailScreen({ navigation, route }) {
  const { user } = useAuth();
  const existingProduct = route.params?.product || null;
  const isCreateMode = route.params?.mode === 'create';
  const isAdmin = user?.role === 'ADMIN';

  const [form, setForm] = useState({
    name: existingProduct?.name || '',
    description: existingProduct?.description || '',
    quantity: existingProduct ? String(existingProduct.quantity) : '0',
    price: existingProduct ? String(existingProduct.price) : '0',
  });
  const [submitting, setSubmitting] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSave() {
    try {
      setSubmitting(true);
      const payload = {
        ...form,
        quantity: Number(form.quantity),
        price: Number(form.price),
      };

      if (isCreateMode) {
        await productApi.create(payload);
      } else {
        await productApi.update(existingProduct.id, payload);
      }

      Alert.alert('Success', isCreateMode ? 'Product created.' : 'Product updated.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Unable to save', error.response?.data?.message || 'Please review the fields.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      setSubmitting(true);
      await productApi.remove(existingProduct.id);
      Alert.alert('Deleted', 'Product removed successfully.');
      navigation.navigate('Products');
    } catch (error) {
      Alert.alert('Unable to delete', error.response?.data?.message || 'Try again later');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScreenContainer>
      <SectionCard
        title={isCreateMode ? 'Create Product' : existingProduct?.name || 'Product Detail'}
        subtitle={
          isAdmin
            ? 'Admins can create, edit, and remove products from inventory.'
            : 'Staff members can review the latest product details.'
        }
      >
        <InputField
          label="Product Name"
          value={form.name}
          onChangeText={(value) => updateField('name', value)}
          placeholder="Wireless Scanner"
          editable={isAdmin}
        />
        <InputField
          label="Description"
          value={form.description}
          onChangeText={(value) => updateField('description', value)}
          placeholder="Short product description"
          multiline
          editable={isAdmin}
        />
        <InputField
          label="Quantity"
          value={form.quantity}
          onChangeText={(value) => updateField('quantity', value)}
          keyboardType="numeric"
          placeholder="0"
          editable={isAdmin}
        />
        <InputField
          label="Price"
          value={form.price}
          onChangeText={(value) => updateField('price', value)}
          keyboardType="decimal-pad"
          placeholder="0.00"
          editable={isAdmin}
        />

        {isAdmin ? (
          <>
            <PrimaryButton title={isCreateMode ? 'Create Product' : 'Save Changes'} onPress={handleSave} loading={submitting} />
            {!isCreateMode ? (
              <PrimaryButton
                title="Delete Product"
                variant="secondary"
                onPress={handleDelete}
                loading={submitting}
              />
            ) : null}
          </>
        ) : null}
      </SectionCard>
    </ScreenContainer>
  );
}
