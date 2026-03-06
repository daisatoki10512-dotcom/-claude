import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const TEAL      = '#0F766E';
const TEAL_DARK = '#1A7063';
const TEXT_PRI  = '#1A1A1A';
const TEXT_SEC  = '#6B7280';
const WHITE     = '#FFFFFF';

// ── Phone mockup showing analysis screen preview ──────
function PhoneMockup() {
  return (
    <View style={mockStyles.phoneFrame}>
      {/* Status bar */}
      <View style={mockStyles.statusBar}>
        <Text style={mockStyles.statusTime}>9:41</Text>
        <View style={mockStyles.statusIcons}>
          <Ionicons name="cellular" size={12} color={TEXT_PRI} />
          <Ionicons name="wifi" size={12} color={TEXT_PRI} />
          <Ionicons name="battery-full" size={12} color={TEXT_PRI} />
        </View>
      </View>

      {/* App header */}
      <View style={mockStyles.appHeader}>
        <Ionicons name="chevron-back" size={16} color={TEXT_PRI} />
        <View style={mockStyles.stepDotsSmall}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View
              key={i}
              style={[
                mockStyles.dotSmall,
                i < 7 ? mockStyles.dotActiveSmall : mockStyles.dotInactiveSmall,
              ]}
            />
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Ionicons name="bookmark-outline" size={14} color={TEXT_PRI} />
          <Ionicons name="close" size={16} color={TEXT_PRI} />
        </View>
      </View>

      {/* App content */}
      <View style={mockStyles.appContent}>
        <Text style={mockStyles.sectionLabel}>今日のふりかえり</Text>

        {/* Mood badge */}
        <View style={mockStyles.moodWrap}>
          <LinearGradient
            colors={['#90B8F8', '#4A8EDF']}
            style={mockStyles.moodCircle}
            start={{ x: 0.2, y: 0.1 }}
            end={{ x: 0.8, y: 0.9 }}
          >
            <Text style={mockStyles.moodEmoji}>😟</Text>
          </LinearGradient>
          <Text style={mockStyles.moodText}>悪い気分</Text>
        </View>

        {/* Detail text */}
        <Text style={mockStyles.detailLabel}>詳細</Text>
        <Text style={mockStyles.bodyText} numberOfLines={4}>
          でも、そう感じるのは、あなたが今の状況を{'\n'}
          良くしたいと真剣に思っている証ですよ。{'\n'}
          もしかしたら上司の方は、単に多忙で余裕が{'\n'}
          ないだけかもしれません。
        </Text>
      </View>
    </View>
  );
}

// ── Main Modal ─────────────────────────────────────────
interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function InfoModal({ visible, onClose }: InfoModalProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Open / close animation
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 200,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Pan responder for drag-to-dismiss
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        gestureState.dy > 10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120 || gestureState.vy > 0.5) {
          // Dismiss
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: SCREEN_HEIGHT,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => onClose());
        } else {
          // Snap back
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 200,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Animated.View
        style={[styles.backdrop, { opacity: backdropOpacity }]}
        pointerEvents="auto"
      >
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY }] }]}
      >
        {/* Drag handle */}
        <View {...panResponder.panHandlers} style={styles.handleArea}>
          <View style={styles.handle} />
        </View>

        {/* Close button */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={12}>
          <Ionicons name="close" size={22} color={TEXT_PRI} />
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>
            気に入った言葉に{'\n'}マーカーを引いてみましょう
          </Text>
          <Text style={styles.subtitle}>
            あとで気に入った言葉を{'\n'}
            {'"'}ブックマーク{'"'}から見返せます。
          </Text>

          <PhoneMockup />
        </View>

        {/* Button */}
        <SafeAreaView>
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onClose}
              style={styles.btnWrapper}
            >
              <LinearGradient
                colors={[TEAL_DARK, TEAL]}
                style={styles.btn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.btnText}>わかりました</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
}

// ── Styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: SCREEN_HEIGHT * 0.82,
  },
  handleArea: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 20,
    zIndex: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: TEXT_PRI,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_SEC,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
  btnWrapper: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  btn: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 50,
  },
  btnText: {
    fontSize: 17,
    fontWeight: '600',
    color: WHITE,
  },
});

// ── Phone mockup styles ────────────────────────────────
const mockStyles = StyleSheet.create({
  phoneFrame: {
    width: 240,
    borderRadius: 28,
    backgroundColor: WHITE,
    borderWidth: 8,
    borderColor: '#1A1A1A',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E5F5EF',
  },
  statusTime: {
    fontSize: 11,
    fontWeight: '600',
    color: TEXT_PRI,
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#E5F5EF',
    borderBottomWidth: 1,
    borderBottomColor: '#D0EBE3',
  },
  stepDotsSmall: {
    flexDirection: 'row',
    gap: 2,
  },
  dotSmall: {
    height: 4,
    borderRadius: 2,
  },
  dotActiveSmall:   { width: 14, backgroundColor: TEAL },
  dotInactiveSmall: { width: 8,  backgroundColor: '#C5DDD8' },
  appContent: {
    backgroundColor: WHITE,
    padding: 10,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT_PRI,
    marginBottom: 8,
  },
  moodWrap: {
    alignItems: 'center',
    marginBottom: 8,
  },
  moodCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  moodEmoji: { fontSize: 22 },
  moodText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3A6BC4',
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: TEAL,
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 9,
    color: TEXT_PRI,
    lineHeight: 15,
  },
});
