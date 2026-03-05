import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  BookOpen,
  TrendingUp,
  ArrowRight,
  MessageCircle,
  Bell,
  Settings,
  ChevronRight,
} from "lucide-react";

// 時間帯に応じた挨拶（サーバーサイドで固定表示、クライアントでは動的化を想定）
function getGreeting() {
  return "こんにちは";
}

const moodItems = [
  {
    emoji: "😊",
    label: "うれしい",
    bg: "bg-[#FFF3E0]",
    border: "border-[#FFD8A8]",
    hover: "hover:bg-[#FFE8C0]",
    ring: "ring-[#FFBA5A]",
  },
  {
    emoji: "😔",
    label: "かなしい",
    bg: "bg-[#EBF5FB]",
    border: "border-[#B3D7F0]",
    hover: "hover:bg-[#D6EAF8]",
    ring: "ring-[#7BB8E0]",
  },
  {
    emoji: "😤",
    label: "イライラ",
    bg: "bg-[#FDECEA]",
    border: "border-[#F5B7B1]",
    hover: "hover:bg-[#FADADD]",
    ring: "ring-[#E8837C]",
  },
  {
    emoji: "😰",
    label: "不安",
    bg: "bg-[#F3E8FD]",
    border: "border-[#D7AEEF]",
    hover: "hover:bg-[#E8D3F8]",
    ring: "ring-[#B778E0]",
  },
  {
    emoji: "😶",
    label: "モヤモヤ",
    bg: "bg-[#F0F0F0]",
    border: "border-[#D0D0D0]",
    hover: "hover:bg-[#E4E4E4]",
    ring: "ring-[#AAAAAA]",
  },
  {
    emoji: "😓",
    label: "つかれた",
    bg: "bg-[#E8F5F0]",
    border: "border-[#A8D8C8]",
    hover: "hover:bg-[#D0EDE4]",
    ring: "ring-[#6DB8A0]",
  },
  {
    emoji: "😌",
    label: "おだやか",
    bg: "bg-[#E8F8E8]",
    border: "border-[#A8D8A8]",
    hover: "hover:bg-[#D0EDD0]",
    ring: "ring-[#6DB86D]",
  },
  {
    emoji: "🥲",
    label: "複雑",
    bg: "bg-[#FEF9E7]",
    border: "border-[#F9E79F]",
    hover: "hover:bg-[#FCF3CF]",
    ring: "ring-[#F4D03F]",
  },
];

const recentRecords = [
  {
    date: "3月4日",
    mood: "😔",
    title: "仕事のプレッシャーと向き合った日",
    tags: ["仕事", "不安", "自己成長"],
    color: "from-blue-50 to-indigo-50",
    tagColor: "bg-blue-100 text-blue-600",
  },
  {
    date: "3月2日",
    mood: "😌",
    title: "小さな達成感を積み重ねる大切さ",
    tags: ["達成感", "自己肯定"],
    color: "from-green-50 to-teal-50",
    tagColor: "bg-green-100 text-green-600",
  },
];

export default function Home() {
  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF6FF] via-[#FFF8F0] to-[#F0F8FF]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-white/50 px-5 py-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* ロゴ + 挨拶 */}
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-2xl font-bold text-[#7C3AED] tracking-tight">
                ふむ
              </span>
              <span className="text-xl">🌿</span>
            </div>
            <p className="text-xs text-gray-400 leading-none">
              {greeting}、今日はどんな気持ち？
            </p>
          </div>
          {/* アイコン群 */}
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Bell className="h-4 w-4 text-gray-500" />
            </button>
            <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Settings className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 pb-20">
        {/* 感情パレット セクション */}
        <section className="pt-6 pb-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800">
              いまの気持ちを選んでね
            </h2>
            <span className="text-xs text-gray-400">タップして話す</span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {moodItems.map((mood) => (
              <Link
                key={mood.label}
                href={`/journal?mood=${encodeURIComponent(mood.label)}`}
              >
                <button
                  className={`
                    w-full aspect-square rounded-[20px] flex flex-col items-center justify-center gap-1.5
                    border ${mood.bg} ${mood.border} ${mood.hover}
                    transition-all duration-200 active:scale-95 active:ring-2 ${mood.ring}
                    shadow-sm hover:shadow-md
                  `}
                >
                  <span className="text-[28px] leading-none">{mood.emoji}</span>
                  <span className="text-[10px] font-medium text-gray-600 leading-none">
                    {mood.label}
                  </span>
                </button>
              </Link>
            ))}
          </div>
        </section>

        {/* 話す ボタン */}
        <section className="py-5">
          <Button
            size="lg"
            className="
              w-full rounded-[24px] py-7 text-base font-bold
              bg-gradient-to-r from-[#7C3AED] to-[#A855F7]
              hover:from-[#6D28D9] hover:to-[#9333EA]
              text-white shadow-lg shadow-violet-200
              transition-all duration-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]
            "
            asChild
          >
            <Link href="/journal" className="flex items-center justify-center gap-2">
              <MessageCircle className="h-5 w-5" />
              気持ちを話す
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <p className="text-center text-xs text-gray-400 mt-3">
            AIが丁寧に聞いてくれます ✨
          </p>
        </section>

        {/* 最近の記録 */}
        <section className="py-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800">最近の記録</h2>
            <Link
              href="/records"
              className="text-xs text-violet-600 flex items-center gap-0.5 hover:text-violet-800 transition-colors"
            >
              すべて見る
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {recentRecords.map((record) => (
              <Card
                key={record.date}
                className="border-0 shadow-sm hover:shadow-md transition-shadow rounded-[24px] overflow-hidden cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-br ${record.color} p-5`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{record.mood}</span>
                          <span className="text-xs text-gray-400">
                            {record.date}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 leading-snug mb-3 truncate">
                          {record.title}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {record.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${record.tagColor}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-300 mt-1 shrink-0" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 統計ミニカード */}
        <section className="py-5">
          <h2 className="text-base font-bold text-gray-800 mb-4">
            今月のきろく
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <BookOpen className="h-5 w-5 text-violet-500" />, value: "8", label: "記録数", bg: "bg-violet-50 border-violet-100" },
              { icon: <Sparkles className="h-5 w-5 text-amber-500" />, value: "5", label: "気づき", bg: "bg-amber-50 border-amber-100" },
              { icon: <TrendingUp className="h-5 w-5 text-teal-500" />, value: "3", label: "連続日数", bg: "bg-teal-50 border-teal-100" },
            ].map((stat) => (
              <Card
                key={stat.label}
                className={`border rounded-[20px] shadow-none ${stat.bg}`}
              >
                <CardContent className="p-4 flex flex-col items-center gap-1">
                  {stat.icon}
                  <p className="text-2xl font-bold text-gray-800 leading-none">
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-gray-500">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-3 safe-area-pb">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {[
            { icon: <MessageCircle className="h-6 w-6" />, label: "話す", href: "/journal", active: false },
            { icon: <BookOpen className="h-6 w-6" />, label: "記録", href: "/records", active: false },
            { icon: <TrendingUp className="h-6 w-6" />, label: "分析", href: "/insights", active: false },
            { icon: <Settings className="h-6 w-6" />, label: "設定", href: "/settings", active: false },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors ${
                item.active ? "text-violet-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
