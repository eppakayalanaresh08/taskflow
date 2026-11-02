import React from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, borderRadius } from '../theme';
import { Icon } from './Icon';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search tasks',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <View style={styles.iconContainer}>
          <Icon name="search" size={18} color="#64748B" />
        </View>

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="never"
        />

        {value.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={onClear}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Clear search input"
          >
            <View style={styles.clearIconCircle}>
              <Icon name="close" size={12} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5EEF8',
    borderRadius: borderRadius.pill,
    paddingHorizontal: 14,
    height: 44,
  },
  iconContainer: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: 6,
  },
  clearIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
