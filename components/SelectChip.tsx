import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
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
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* アイコン領域は常に確保してチップ幅を固定 */}
      <View style={styles.iconSlot}>
        {selected && <Ionicons name="checkmark" size={14} color={TEAL} />}
      </View>
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
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFF',
  },
  chipSelected: {
    borderWidth: 2,
    borderColor: TEAL,
    // border が 1→2px (+1px/辺) になる分、padding を 1px 削って外寸を固定する
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  iconSlot: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
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
