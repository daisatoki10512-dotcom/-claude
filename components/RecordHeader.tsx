import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';

export const SCREEN_BG = 'rgba(240, 253, 250, 0.96)';
const TEXT_PRI    = '#1A1A1A';
const TEAL        = '#0F766E';
const TOTAL_STEPS = 8;

interface RecordHeaderProps {
  current: number;
  onBack?: () => void;
  onClose?: () => void;
  rightExtra?: React.ReactNode;
}

export default function RecordHeader({
  current,
  onBack,
  onClose,
  rightExtra,
}: RecordHeaderProps) {
  return (
    <View style={styles.header}>
      {/* 左: 戻る */}
      <TouchableOpacity
        onPress={onBack ?? (() => router.back())}
        hitSlop={12}
        style={styles.side}
      >
        <Ionicons name="chevron-back" size={32} color={TEXT_PRI} />
      </TouchableOpacity>

      {/* 中央: ステップドット */}
      <View style={styles.dots}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i < current ? styles.dotActive : styles.dotInactive]}
          />
        ))}
      </View>

      {/* 右: 閉じる (+ optional extra) */}
      <View style={[styles.side, styles.rightSide]}>
        {rightExtra}
        <TouchableOpacity
          onPress={onClose ?? (() => router.dismissAll())}
          hitSlop={12}
        >
          <Ionicons name="close" size={32} color={TEXT_PRI} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SCREEN_BG,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  side: {
    width: 48,
    alignItems: 'flex-start',
  },
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
  dots: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  dot:         { height: 6, borderRadius: 3 },
  dotActive:   { width: 24, backgroundColor: TEAL },
  dotInactive: { width: 14, backgroundColor: '#C5DDD8' },
});
