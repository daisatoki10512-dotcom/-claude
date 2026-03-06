import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TEAL = '#0F766E';

interface SelectChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export default function SelectChip({ label, selected, onPress }: SelectChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected ? styles.chipSelected : styles.chipDefault]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {selected && (
        <Ionicons name="checkmark" size={14} color={TEAL} style={styles.icon} />
      )}
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  chipDefault: {
    borderColor: '#E5E7EB',
  },
  chipSelected: {
    borderColor: TEAL,
  },
  icon: {
    marginTop: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  labelSelected: {
    color: TEAL,
    fontWeight: '600',
  },
});
