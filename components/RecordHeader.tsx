import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';

export const SCREEN_BG = 'rgba(240, 253, 250, 0.96)';
export const HEADER_INNER_HEIGHT = 52; // paddingTop(12) + icon(32) + paddingBottom(8)
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
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
    width: 160,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  dot:         { width: 16.5, height: 6, borderRadius: 3 },
  dotActive:   { backgroundColor: TEAL },
  dotInactive: { backgroundColor: '#C5DDD8' },
});
