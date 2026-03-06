import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const TEAL = '#0F766E';

interface SelectChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export default function SelectChip({ label, selected, onPress }: SelectChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.75}
    >
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
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFF',
  },
  chipSelected: {
    borderWidth: 2,
    borderColor: TEAL,
    // border +1px/辺 → padding を 1px 削って外寸を固定
    paddingVertical: 6,
    paddingHorizontal: 14,
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
