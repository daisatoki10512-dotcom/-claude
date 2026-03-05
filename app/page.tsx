import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  BookOpen,
  TrendingUp,
  ArrowRight,
  Heart,
  MessageCircle,
} from "lucide-react";

const moodEmojis = [
  { emoji: "😔", label: "落ち込み", color: "bg-blue-100 hover:bg-blue-200" },
  { emoji: "😟", label: "不安", color: "bg-purple-100 hover:bg-purple-200" },
  { emoji: "😤", label: "イライラ", color: "bg-red-100 hover:bg-red-200" },
  { emoji: "😶", label: "モヤモヤ", color: "bg-gray-100 hover:bg-gray-200" },
  { emoji: "😌", label: "穏やか", color: "bg-green-100 hover:bg-green-200" },
  { emoji: "🥲", label: "複雑", color: "bg-yellow-100 hover:bg-yellow-200" },
];

const features = [
  {
    icon: <MessageCircle className="h-6 w-6 text-violet-500" />,
    title: "AI対話ジャーナリング",
    description:
      "AIが寄り添い、あなたのモヤモヤを一緒に解きほぐします。3〜5往復の対話で気持ちを整理。",
  },
  {
    icon: <Sparkles className="h-6 w-6 text-amber-500" />,
    title: "自己理解インサイト",
    description:
      "対話の後、AIがあなたの感情と価値観を分析。「新しい気づき」を言葉にして届けます。",
  },
  {
    icon: <BookOpen className="h-6 w-6 text-teal-500" />,
    title: "記録の資産化",
    description:
      "すべての対話がカード形式で保存。過去の自分を振り返り、成長を実感できます。",
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-rose-500" />,
    title: "感情の傾向分析",
    description:
      "何度も記録することで、あなたの感情パターンが見えてきます。",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-purple-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-violet-500 fill-violet-200" />
          <span className="text-xl font-bold text-violet-800 tracking-wide">
            ふむ
          </span>
        </div>
        <nav className="flex gap-4">
          <Button variant="ghost" size="sm" className="text-violet-700">
            記録を見る
          </Button>
          <Button
            size="sm"
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            はじめる
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center px-6 pt-16 pb-12 max-w-3xl mx-auto">
        <Badge className="mb-4 bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-100">
          メンタルケアアプリ
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
          言語化できない
          <span className="text-violet-600">モヤモヤ</span>を、<br />
          自己理解の資産に。
        </h1>
        <p className="text-lg text-gray-500 mb-10 leading-relaxed">
          「ふむ」は、AIとの対話を通じて、
          <br className="hidden md:block" />
          あなたの気持ちを整理し、新しい自分への気づきをお届けします。
        </p>

        {/* Mood Palette CTA */}
        <div className="bg-white rounded-3xl shadow-sm border border-violet-100 p-8 mb-6">
          <p className="text-sm font-medium text-gray-500 mb-5">
            今のきもちを選んではじめましょう
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            {moodEmojis.map((mood) => (
              <Link
                key={mood.label}
                href={`/journal?mood=${encodeURIComponent(mood.label)}`}
              >
                <button
                  className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${mood.color} active:scale-95`}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-xs text-gray-600 font-medium">
                    {mood.label}
                  </span>
                </button>
              </Link>
            ))}
          </div>
          <Button
            size="lg"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-6 text-base font-semibold"
            asChild
          >
            <Link href="/journal" className="flex items-center gap-2">
              今すぐ話す
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
        <p className="text-sm text-gray-400">登録不要でお試しいただけます</p>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-10">
          「ふむ」でできること
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-0 shadow-sm bg-white/70 backdrop-blur-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-gray-50 shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-16 text-center max-w-xl mx-auto">
        <p className="text-gray-600 mb-6 leading-relaxed">
          毎日少しずつ、自分を理解していく。
          <br />
          そのための場所が「ふむ」です。
        </p>
        <Button
          size="lg"
          className="bg-violet-600 hover:bg-violet-700 text-white px-10 py-6 rounded-2xl text-base font-semibold"
          asChild
        >
          <Link href="/journal" className="flex items-center gap-2">
            今の気持ちを話してみる
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <p>© 2024 ふむ — メンタルケアアプリ</p>
      </footer>
    </div>
  );
}
