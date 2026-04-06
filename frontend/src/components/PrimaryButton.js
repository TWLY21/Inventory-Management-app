import {ActivityIndicator, Pressable, StyleSheet, Text} from 'react-native';

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}) {
  const isDisabled = loading || disabled;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.button,
        variant === 'secondary' ? styles.secondary : styles.primary,
        isDisabled && styles.disabled,
      ]}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' ? '#0f172a' : '#ffffff'}
        />
      ) : (
        <Text
          style={[
            styles.text,
            variant === 'secondary' ? styles.secondaryText : null,
          ]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  primary: {
    backgroundColor: '#0f172a',
  },
  secondary: {
    backgroundColor: '#e2e8f0',
  },
  disabled: {
    opacity: 0.65,
  },
  text: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryText: {
    color: '#0f172a',
  },
});
