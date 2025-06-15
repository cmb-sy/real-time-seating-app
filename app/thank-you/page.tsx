"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HeaderNav } from "@/components/ui/header-nav";
import {
  Heart,
  Star,
  Gift,
  Sparkles,
  Users,
  Coffee,
  Zap,
  Trophy,
} from "lucide-react";

export default function ThankYouPage() {
  const achievements = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "チームワーク向上",
      description: "効率的な座席管理でチームの連携が向上しました",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "生産性アップ",
      description: "リアルタイム更新により作業効率が大幅に改善",
    },
    {
      icon: <Coffee className="h-8 w-8" />,
      title: "快適な環境",
      description: "ストレスフリーな座席選択で働きやすさが向上",
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "目標達成",
      description: "スマートなオフィス運営を実現しました",
    },
  ];

  const testimonials = [
    {
      name: "田中さん",
      role: "プロジェクトマネージャー",
      comment: "座席管理が簡単になって、チーム運営がスムーズになりました！",
      rating: 5,
    },
    {
      name: "佐藤さん",
      role: "エンジニア",
      comment: "リアルタイム更新が素晴らしく、とても使いやすいです。",
      rating: 5,
    },
    {
      name: "山田さん",
      role: "デザイナー",
      comment: "美しいUIで毎日使うのが楽しくなりました。",
      rating: 5,
    },
  ];

  return (
    <div className="scrollable-page min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <HeaderNav />

      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* メインヒーロー */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-pink-100 rounded-full px-4 py-2 mb-6">
              <Heart className="h-4 w-4 text-pink-600 animate-pulse" />
              <span className="text-pink-800 font-medium">Thank You</span>
            </div>

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                  ありがとう
                </h1>
                <Sparkles className="absolute -top-4 -right-4 h-8 w-8 text-yellow-400 animate-bounce" />
                <Gift className="absolute -bottom-2 -left-4 h-6 w-6 text-pink-400 animate-pulse" />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8"
            >
              リアルタイム座席管理システムをご利用いただき、
              <br />
              心より感謝申し上げます 🎉
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => (window.location.href = "/")}
              >
                <Heart className="h-5 w-5 mr-2" />
                座席管理に戻る
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-3 rounded-xl font-bold"
                onClick={() => (window.location.href = "/analytics")}
              >
                <Star className="h-5 w-5 mr-2" />
                統計を見る
              </Button>
            </motion.div>
          </motion.div>

          {/* 成果セクション */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              あなたの成果
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 text-center hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-purple-600 mb-4 flex justify-center">
                    {achievement.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {achievement.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* お客様の声 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              お客様の声
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.3 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  <p className="text-gray-600 mb-4 italic">
                    "{testimonial.comment}"
                  </p>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="font-semibold text-gray-800">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 最終メッセージ */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative">
                <Heart className="h-16 w-16 mx-auto mb-6 text-pink-200 animate-pulse" />
                <h2 className="text-3xl font-bold mb-4">
                  今後ともよろしくお願いします
                </h2>
                <p className="text-purple-100 mb-6 max-w-2xl mx-auto text-lg">
                  皆様のフィードバックを大切にし、
                  より良いサービスの提供に努めてまいります。
                  引き続きご愛用ください。
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    variant="outline"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    onClick={() => (window.location.href = "/contact")}
                  >
                    ご意見・ご要望
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    onClick={() => (window.location.href = "/about")}
                  >
                    サービス詳細
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
