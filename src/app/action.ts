"use server";

import { mastra } from "../../mastra";

export interface HealthInput {
  diet: string;
  exercise: string;
  sleep: string;
  concerns: string;
}

export interface HealthPlan {
  advice: string;
  exerciseRecommendations: string;
  dietRecommendations: string;
  generalTips: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
}

export async function getHealthPlan(input: HealthInput): Promise<HealthPlan> {
  const agent = mastra.getAgent("healthAgent");

  const prompt = `
以下の情報を基に、個人に合わせた健康アドバイスを提供してください：

食事習慣: ${input.diet}
運動習慣: ${input.exercise}
睡眠状況: ${input.sleep}
健康に関する悩み: ${input.concerns}

必ず以下の番号付きリスト形式で回答してください：

1. 総合的なアドバイス
（現在の状況の評価と改善のポイントを具体的に記載）

2. 運動の推奨事項
（具体的な運動メニューや頻度を詳しく記載）

3. 食事の推奨事項
（食材や料理の提案、栄養バランスのアドバイスを詳しく記載）

4. その他の健康管理のコツ
（睡眠、ストレス管理などの具体的なアドバイスを記載）

重要：必ず「1.」「2.」「3.」「4.」で始まる番号付きリストの形式で回答してください。各項目は実践しやすい具体的なアドバイスにしてください。
`;

  const result = await agent.generate(prompt);

  // より正確にセクションを分ける
  const text = result.text;

  console.log("AI Agent Output:", text);

  // 番号付きリストを見つけて適切にセクション分けする
  const parseHealthAdvice = (text: string) => {
    const sections = ["", "", "", ""];
    let currentSection = -1;

    const lines = text.split("\n");
    for (const line of lines) {
      const trimmedLine = line.trim();

      // 番号付き太字見出し形式の認識（1. **総合的なアドバイス** など）
      if (
        trimmedLine.match(/^1\.\s*\*\*総合的なアドバイス\*\*/) ||
        trimmedLine.includes("総合的なアドバイス") ||
        (trimmedLine.match(/^1\./) &&
          trimmedLine.toLowerCase().includes("総合"))
      ) {
        currentSection = 0;
        // 見出し行はスキップして、次の行から内容を取得
        continue;
      } else if (
        trimmedLine.match(/^2\.\s*\*\*運動の推奨事項\*\*/) ||
        trimmedLine.includes("運動の推奨事項") ||
        (trimmedLine.match(/^2\./) &&
          trimmedLine.toLowerCase().includes("運動"))
      ) {
        currentSection = 1;
        continue;
      } else if (
        trimmedLine.match(/^3\.\s*\*\*食事の推奨事項\*\*/) ||
        trimmedLine.includes("食事の推奨事項") ||
        (trimmedLine.match(/^3\./) &&
          trimmedLine.toLowerCase().includes("食事"))
      ) {
        currentSection = 2;
        continue;
      } else if (
        trimmedLine.match(/^4\.\s*\*\*その他の健康管理/) ||
        trimmedLine.includes("その他の健康管理") ||
        trimmedLine.includes("健康管理のコツ") ||
        (trimmedLine.match(/^4\./) &&
          (trimmedLine.toLowerCase().includes("その他") ||
            trimmedLine.toLowerCase().includes("健康管理")))
      ) {
        currentSection = 3;
        continue;
      } else if (trimmedLine.match(/^1\./)) {
        currentSection = 0;
        sections[0] += trimmedLine.replace(/^1\.\s*/, "") + "\n";
      } else if (trimmedLine.match(/^2\./)) {
        currentSection = 1;
        sections[1] += trimmedLine.replace(/^2\.\s*/, "") + "\n";
      } else if (trimmedLine.match(/^3\./)) {
        currentSection = 2;
        sections[2] += trimmedLine.replace(/^3\.\s*/, "") + "\n";
      } else if (trimmedLine.match(/^4\./)) {
        currentSection = 3;
        sections[3] += trimmedLine.replace(/^4\.\s*/, "") + "\n";
      } else if (currentSection >= 0 && trimmedLine.length > 0) {
        sections[currentSection] += line + "\n";
      }
    }

    return sections.map((section) => section.trim());
  };

  const parsedSections = parseHealthAdvice(text);

  return {
    advice: parsedSections[0] || text,
    exerciseRecommendations:
      parsedSections[1] || "運動に関する具体的なアドバイスが生成されました。",
    dietRecommendations:
      parsedSections[2] || "食事に関する具体的なアドバイスが生成されました。",
    generalTips: parsedSections[3] || "その他の健康管理のコツをお伝えします。",
  };
}

export async function sendChatMessage(
  message: string,
  chatHistory: ChatMessage[]
): Promise<ChatResponse> {
  const agent = mastra.getAgent("healthAgent");

  // 会話履歴を含むプロンプトを構築
  let conversationContext = "";
  if (chatHistory.length > 0) {
    conversationContext = "\n\n過去の会話:\n";
    chatHistory.slice(-10).forEach((msg) => { // 直近10件のみ
      const role = msg.role === "user" ? "ユーザー" : "マルモ";
      conversationContext += `${role}: ${msg.content}\n`;
    });
    conversationContext += "\n---\n";
  }

    const prompt = `${conversationContext}

ユーザーからの新しいメッセージ: ${message}

あなたは健康アドバイザーの「マルモ」として、上記のメッセージに親身に回答してください。
必要に応じて追加の質問をしたり、具体的なアドバイスを提供してください。
会話の流れを考慮して、自然で有用な回答をお願いします。`;

  const result = await agent.generate(prompt);

  // LLMにフォローアップ質問の提案も生成してもらう
  const suggestionPrompt = `${conversationContext}

ユーザーからの新しいメッセージ: ${message}
マルモの回答: ${result.text}

上記の会話の流れを考慮して、ユーザーがより詳しく健康について相談できるような、自然で具体的なメッセージを2-3個提案してください。

重要：提案は「ユーザーが送信するメッセージ」として書いてください。例：
- 「もっと詳しく教えてください」
- 「朝食を抜くことが多いです」
- 「週末の運動方法を知りたいです」

以下の形式で回答してください：
- メッセージ1
- メッセージ2
- メッセージ3

各メッセージは30文字以内で、ユーザーが気軽に送信できるような内容にしてください。`;

  let suggestions: string[] = [];

  try {
    const suggestionResult = await agent.generate(suggestionPrompt);
    // 回答から質問を抽出
    const lines = suggestionResult.text.split('\n');
    suggestions = lines
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace(/^-\s*/, '').trim())
      .filter(line => line.length > 0 && line.length <= 50) // 長すぎる質問を除外
      .slice(0, 3); // 最大3個まで
  } catch (error) {
    console.error("Error generating suggestions:", error);
    // フォールバック: シンプルな提案
    suggestions = ["もう少し詳しく教えてください", "他に気になることはありますか？"];
  }

  return {
    message: result.text,
    suggestions: suggestions.length > 0 ? suggestions : undefined
  };
}

export async function getSimpleHealthAdvice(input: string): Promise<string> {
  const agent = mastra.getAgent("healthAgent");

  const result = await agent.generate(input);
  return result.text;
}
