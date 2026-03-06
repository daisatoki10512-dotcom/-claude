import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Anthropic from '@anthropic-ai/sdk';

// ── Colors ────────────────────────────────────────────
const BG         = '#E5F5EF';
const TEAL       = '#2AA090';
const TEAL_DARK  = '#1A7063';
const TEXT_PRI   = '#1A1A1A';
const TEXT_SEC   = '#6B7280';
const WHITE      = '#FFFFFF';

// ── Types ─────────────────────────────────────────────
type Role = 'user' | 'assistant';
type Message = { id: string; role: Role; text: string };

// ── Claude クライアント ────────────────────────────────
function createClient(): Anthropic | null {
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === 'your_anthropic_api_key_here') return null;
  return new Anthropic({ apiKey });
}

const SYSTEM_PROMPT = `あなたは感情日記アプリ「こころ」の専属AIカウンセラーです。
ユーザーの気持ちや悩みに寄り添い、共感的に傾聴しながら、穏やかで温かみのある返答をしてください。
- 返答は短めにまとめ（4〜6文程度）、押しつけがましいアドバイスは避けてください
- ユーザーが話を続けやすいよう、必要なら優しく問いかけを添えてください
- 日本語で返答してください`;

// ── Message bubble ────────────────────────────────────
function Bubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <View style={[styles.bubbleRow, isUser ? styles.bubbleRowUser : styles.bubbleRowAI]}>
      {!isUser && (
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>AI</Text>
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
        <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
          {message.text}
        </Text>
      </View>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────
export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      text: 'こんにちは。今日の気持ちや、気になっていることをなんでも話してください。',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  // 新しいメッセージが追加されたら末尾へスクロール
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    const nextMessages = [...messages, userMsg];

    setInputText('');
    setMessages(nextMessages);
    setLoading(true);
    setApiError(null);

    const client = createClient();
    if (!client) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + '_err',
          role: 'assistant',
          text: 'APIキーが設定されていません。プロジェクトルートの .env ファイルに EXPO_PUBLIC_ANTHROPIC_API_KEY を設定してください。',
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      // Anthropic SDK の messages.create を使用
      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: nextMessages
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .map((m) => ({
            role: m.role,
            content: m.text,
          })),
      });

      const textBlock = response.content.find((b) => b.type === 'text');
      const replyText = textBlock && textBlock.type === 'text'
        ? textBlock.text
        : '（返答を取得できませんでした）';

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + '_ai', role: 'assistant', text: replyText },
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setApiError(msg);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + '_err',
          role: 'assistant',
          text: `エラーが発生しました: ${msg}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── ヘッダー ─────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={TEXT_PRI} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AIカウンセラー</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* ── メッセージ一覧 ────────────────────── */}
        <ScrollView
          ref={scrollRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((m) => (
            <Bubble key={m.id} message={m} />
          ))}
          {loading && (
            <View style={[styles.bubbleRow, styles.bubbleRowAI]}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>AI</Text>
              </View>
              <View style={[styles.bubble, styles.bubbleAI, styles.loadingBubble]}>
                <ActivityIndicator size="small" color={TEAL} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* ── 入力バー ─────────────────────────── */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="メッセージを入力..."
            placeholderTextColor={TEXT_SEC}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!inputText.trim() || loading) && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || loading}
            activeOpacity={0.8}
          >
            <Ionicons
              name="arrow-up"
              size={20}
              color={WHITE}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  flex: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DDE8E4',
    backgroundColor: BG,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: TEXT_PRI,
  },

  // Message list
  messageList: {
    flex: 1,
    backgroundColor: BG,
  },
  messageListContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },

  // Bubbles
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  bubbleRowUser: {
    justifyContent: 'flex-end',
  },
  bubbleRowAI: {
    justifyContent: 'flex-start',
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginBottom: 2,
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: WHITE,
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleUser: {
    backgroundColor: TEAL_DARK,
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: WHITE,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  loadingBubble: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  bubbleText: {
    fontSize: 15,
    color: TEXT_PRI,
    lineHeight: 22,
  },
  bubbleTextUser: {
    color: WHITE,
  },

  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 12 : 16,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: '#DDE8E4',
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 120,
    backgroundColor: BG,
    borderRadius: 21,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: TEXT_PRI,
    lineHeight: 20,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sendBtnDisabled: {
    backgroundColor: '#C5DDD8',
  },
});
