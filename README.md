# 健康管理AIエージェント

食事内容や運動習慣を入力すると、AIが健康アドバイスや改善プランを提案してくれるWebアプリケーションです。

## 機能

- 💬 **チャット機能**: AIエージェントと継続的な対話が可能
- 📋 **健康プラン作成**: 食事、運動、睡眠、健康の悩みを入力して総合的なアドバイスを取得
- 🤖 **AI生成提案**: 会話に基づいた関連する相談内容を自動提案
- 📱 **レスポンシブデザイン**: モバイルとデスクトップの両方に対応

## 技術スタック

- **フレームワーク**: Next.js 15.3.4
- **AI**: Mastra + OpenAI GPT-4o-mini
- **UI**: React 19 + Tailwind CSS
- **マークダウン**: react-markdown
- **言語**: TypeScript

## セットアップ

### 1. リポジトリをクローン

```bash
git clone <repository-url>
cd ai-agent-sample
```

### 2. 依存関係をインストール

```bash
npm install
# または
yarn install
```

### 3. 環境変数を設定

`.env.example`をコピーして`.env.development`を作成：

```bash
cp .env.example .env.development
```

`.env.development`ファイルにOpenAI APIキーを設定：

```plaintext
OPENAI_API_KEY=your_openai_api_key_here
```

OpenAI APIキーは[こちら](https://platform.openai.com/api-keys)から取得できます。

### 4. 開発サーバーを起動

```bash
npm run dev
# または
yarn dev
```

[http://localhost:3000](http://localhost:3000)でアプリケーションにアクセスできます。

## 使用方法

1. **チャットモード**: AIエージェントと自由に健康について相談
2. **プランモード**: 構造化されたフォームで健康状況を入力し、詳細なアドバイスを取得

## プロジェクト構造

```
├── src/
│   └── app/
│       ├── components/
│       │   ├── Chat.tsx      # チャット機能
│       │   └── Plan.tsx      # 健康プラン作成
│       ├── action.ts         # サーバーアクション
│       ├── layout.tsx        # レイアウト
│       └── page.tsx          # メインページ
├── mastra/
│   ├── agents/
│   │   └── healthAgent.ts    # 健康管理AIエージェント
│   └── index.ts              # Mastra設定
└── public/                   # 静的ファイル
```

## カスタマイズ

- `mastra/agents/healthAgent.ts`: AIエージェントの性格や専門知識を調整
- `src/app/action.ts`: 健康プランの出力形式やプロンプトを変更
- `src/app/components/`: UIコンポーネントのデザインを変更

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します！
