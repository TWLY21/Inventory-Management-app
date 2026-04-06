import {Pressable, StyleSheet, Text, View} from 'react-native';

export default function ProductCard({product, onPress}) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${Number(product.price).toFixed(2)}</Text>
      </View>
      <Text style={styles.description}>
        {product.description || 'No description provided.'}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.meta}>Qty: {product.quantity}</Text>
        <Text style={styles.meta}>Tap to view</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f766e',
  },
  description: {
    color: '#475569',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meta: {
    fontSize: 13,
    color: '#64748b',
  },
});
