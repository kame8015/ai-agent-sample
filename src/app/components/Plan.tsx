"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { getHealthPlan, HealthInput, HealthPlan } from "../action";

export function Plan() {
  const [healthPlan, setHealthPlan] = useState<HealthPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    try {
      const input: HealthInput = {
        diet: formData.get("diet") as string,
        exercise: formData.get("exercise") as string,
        sleep: formData.get("sleep") as string,
        concerns: formData.get("concerns") as string,
      };

      const result = await getHealthPlan(input);
      setHealthPlan(result);
    } catch (err) {
      setError("健康プランの生成中にエラーが発生しました。");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🏥 健康管理エージェント - マルモ
        </h2>

        <form action={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="diet" className="block text-sm font-medium text-gray-700 mb-2">
                🍽️ 食事習慣
              </label>
              <textarea
                name="diet"
                id="diet"
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none hover:border-blue-400 text-gray-900 placeholder-gray-500 bg-white"
                placeholder="例：最近野菜をあまり食べていない、外食が多い、朝食を抜くことが多い..."
                required
              />
            </div>

            <div>
              <label htmlFor="exercise" className="block text-sm font-medium text-gray-700 mb-2">
                🏃‍♂️ 運動習慣
              </label>
              <textarea
                name="exercise"
                id="exercise"
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none hover:border-blue-400 text-gray-900 placeholder-gray-500 bg-white"
                placeholder="例：デスクワークが多く運動不足、週に1〜2回ジムに通っている、散歩を心がけている..."
                required
              />
            </div>

            <div>
              <label htmlFor="sleep" className="block text-sm font-medium text-gray-700 mb-2">
                😴 睡眠状況
              </label>
              <textarea
                name="sleep"
                id="sleep"
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none hover:border-blue-400 text-gray-900 placeholder-gray-500 bg-white"
                placeholder="例：夜更かしが多い、6時間程度の睡眠、朝起きるのが辛い..."
                required
              />
            </div>

            <div>
              <label htmlFor="concerns" className="block text-sm font-medium text-gray-700 mb-2">
                💭 健康に関する悩み
              </label>
              <textarea
                name="concerns"
                id="concerns"
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none hover:border-blue-400 text-gray-900 placeholder-gray-500 bg-white"
                placeholder="例：体重が気になる、疲れやすい、肩こりがひどい、集中力が続かない..."
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-md transition duration-200 cursor-pointer disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isLoading ? "📋 健康プランを作成中..." : "🎯 健康プランを作成"}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md">
          ❌ {error}
        </div>
      )}

      {healthPlan && (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
            📊 あなたの健康プラン
          </h3>

          <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">💡 総合的なアドバイス</h4>
              <div className="text-gray-700 prose prose-sm max-w-none">
                <ReactMarkdown>{healthPlan.advice}</ReactMarkdown>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">🏃‍♂️ 運動の推奨事項</h4>
              <div className="text-gray-700 prose prose-sm max-w-none">
                <ReactMarkdown>{healthPlan.exerciseRecommendations}</ReactMarkdown>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">🍎 食事の推奨事項</h4>
              <div className="text-gray-700 prose prose-sm max-w-none">
                <ReactMarkdown>{healthPlan.dietRecommendations}</ReactMarkdown>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">✨ その他の健康管理のコツ</h4>
              <div className="text-gray-700 prose prose-sm max-w-none">
                <ReactMarkdown>{healthPlan.generalTips}</ReactMarkdown>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-md">
            <p className="text-sm text-yellow-800">
              ⚠️ このアドバイスは一般的な健康情報です。医学的な診断や治療については、必ず医療専門家にご相談ください。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
