# 🎬 Movie Search App

TMDb API を利用した映画検索アプリです。  
キーワードとリリース年で映画を検索し、ジャンルや公開日付きでカード表示されます。

## 🔧 使用技術

- Frontend: Vite + React + TypeScript
- Backend: Express + Node.js
- API: The Movie Database (TMDb)
- Hosting: Vercel（client） / Render（server）

## 🖥️ デモ

- クライアント（Vercel）: https://movie-search-app-250510.vercel.app/
- サーバーAPI（Render）: https://movie-search-app-ehgg.onrender.com/api/movies?query=%E5%90%9B%E3%81%AE%E5%90%8D%E3%81%AF&page=1

## 🚀 ローカル開発手順

```bash
git clone https://github.com/your-name/movie-search-app.git
cd movie-search-app
```

### サーバーのセットアップ

```bash
cd server
cp .env.example .env
npm install
npm start
```

### クライアントのセットアップ

```bash
cd ../client
cp .env.example .env
npm install
npm run dev
```

## ⚙️ 環境変数の設定例

### server/.env

```
TMDB_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
```

※環境変数はgitで管理していないため、各自で設定をお願いします。

### client/.env

```
VITE_API_BASE_URL=http://localhost:3001/api
```

※環境変数はgitで管理していないため、各自で設定をお願いします。

## 📦 本番用ビルド

```bash
cd client
npm run build
```

## 📝 コミットメッセージルール

このプロジェクトでは、以下の最小限のルールに沿ってコミットメッセージを記述します。

| 絵文字 | type      | 用途                         |
| ------ | --------- | ---------------------------- |
| ✨     | add:      | 新機能の追加                 |
| 👍     | update:   | 修正                         |
| 🐛     | fix:      | バグ修正                     |
| ♻️     | refactor: | 挙動を変えないコード改善     |
| 🔥     | remove:   | 不要なファイルやコードの削除 |
| 📦     | package:  | 環境周りの修正               |
| 📝     | docs:     | ドキュメント・READMEの変更   |

### コミットメッセージ例：

```bash
git commit -m "📦:package: 開発環境用の VITE_API_BASE_URL を .env に追加"
git commit -m "🐛:fix: APIキーが読み込まれない不具合を修正"
```
