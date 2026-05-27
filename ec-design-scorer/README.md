# EC デザイン採点ツール

バナー・LP画像をアップロードするとAIが6観点で採点してくれるWebツールです。

## フォルダ構成

```
ec-design-scorer/
├── api/
│   └── score.js        ← バックエンド（APIキーをここで管理）
├── public/
│   └── index.html      ← フロントエンド（ブラウザに表示される画面）
├── vercel.json         ← Vercelの設定
└── README.md
```

---

## デプロイ手順（15分でできます）

### Step 1: GitHubにリポジトリを作る

1. https://github.com を開く
2. 右上の「+」→「New repository」をクリック
3. Repository name: `ec-design-scorer`
4. Public or Private（どちらでも可）
5. 「Create repository」をクリック

### Step 2: ファイルをGitHubにアップロード

GitHubのページで「uploading an existing file」をクリックして
このフォルダの中身をそのままドラッグ＆ドロップ。
（フォルダ構成を保ったままアップロードしてください）

コミットメッセージは「initial commit」でOK。

### Step 3: Vercelにデプロイする

1. https://vercel.com にアクセス（GitHubアカウントでサインアップ）
2. 「Add New Project」をクリック
3. GitHubの `ec-design-scorer` を選択して「Import」
4. 設定は変えずそのまま「Deploy」をクリック

→ 数分で `https://ec-design-scorer-xxx.vercel.app` のようなURLが発行されます

### Step 4: APIキーを設定する（重要）

1. Vercelのプロジェクトページを開く
2. 「Settings」→「Environment Variables」
3. 以下を追加：
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-xxxxxxxx...`（AnthropicのAPIキー）
4. 「Save」→「Redeploy」

https://console.anthropic.com でAPIキーを取得できます。

---

## 採点観点

| 観点 | 配点 |
|------|------|
| 視認性・可読性 | 20点 |
| 購買訴求力 | 20点 |
| ビジュアルインパクト | 20点 |
| 情報設計 | 20点 |
| ブランド整合性 | 10点 |
| 技術品質 | 10点 |
| **合計** | **100点** |

## 費用目安

- Vercel: 無料プランで運用可能
- Anthropic API: 1回の採点あたり約1〜3円程度
