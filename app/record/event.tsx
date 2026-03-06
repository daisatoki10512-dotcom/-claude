import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useRecordStore } from '../../store/recordStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import RecordHeader, { SCREEN_BG } from '../../components/RecordHeader';

const BG_TOP      = '#E5F5EF';
const BG_BOT      = '#DDF0E8';
const TEXT_PRI    = '#1A1A1A';
const TEXT_SEC    = '#6B7280';
const TEAL        = '#2AA090';
const TEAL_DARK   = '#1A7063';
export default function EventScreen() {
  const [text, setText] = useState('');
  const canNext = text.trim().length > 0;
  const setEvent = useRecordStore(s => s.setEvent);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.kav}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <RecordHeader current={3} />

          {/* コンテンツ */}
          <View style={styles.content}>
            <Text style={styles.title}>どんな出来事があったか{'\n'}振り返ってみましょう</Text>
            <Text style={styles.subtitle}>
              そのとき何があったのかを整理すると{'\n'}気分の流れがつかみやすくなります。
            </Text>

            <TextInput
              style={styles.textarea}
              placeholder="どんな出来事があったか記載してください。"
              placeholderTextColor={TEXT_SEC}
              value={text}
              onChangeText={setText}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* フッター */}
          <View style={styles.footer}>
            <TouchableOpacity
              disabled={!canNext}
              activeOpacity={0.85}
              onPress={() => { setEvent(text); router.push('/record/thought'); }}
              style={styles.nextBtnWrapper}
            >
              <LinearGradient
                colors={canNext ? [TEAL_DARK, TEAL] : ['#E5E7EB', '#E5E7EB']}
                style={styles.nextBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={[styles.nextBtnText, !canNext && styles.nextBtnTextDisabled]}>
                  次へ
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SCREEN_BG },
  safe: { flex: 1 },
  kav:  { flex: 1 },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: TEXT_PRI,
    lineHeight: 38,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_SEC,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  textarea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
    color: TEXT_PRI,
    minHeight: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
  },
  nextBtnWrapper: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  nextBtn: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 50,
  },
  nextBtnText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  nextBtnTextDisabled: {
    color: '#9CA3AF',
  },
});
