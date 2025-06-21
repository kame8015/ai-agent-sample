"use client";

import { useState } from "react";
import { Plan } from "./components/Plan";
import { Chat } from "./components/Chat";

function HomePage() {
  const [activeMode, setActiveMode] = useState<"plan" | "chat">("chat");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🏥 健康管理AIエージェント
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            あなたの健康アドバイザー「マルモ」が、食事・運動・睡眠の情報から
            <br />
            個人に合わせた健康プランを提案します
          </p>

          {/* モード選択 */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setActiveMode("chat")}
              className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${
                activeMode === "chat"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
              }`}
            >
              💬 チャットで相談
            </button>
            <button
              onClick={() => setActiveMode("plan")}
              className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${
                activeMode === "plan"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
              }`}
            >
              📋 健康プラン作成
            </button>
          </div>
        </header>

        {/* コンテンツエリア */}
        {activeMode === "chat" ? <Chat /> : <Plan />}

        <footer className="text-center mt-12 text-gray-500">
          <div className="space-y-2">
            <p className="text-sm">
              🤖 AIエージェントが健康管理をサポートします
            </p>
            <p className="text-xs">
              ※ このサービスは一般的な健康情報を提供するものです。
              医学的なアドバイスが必要な場合は、医療専門家にご相談ください。
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  return <HomePage />;
}
