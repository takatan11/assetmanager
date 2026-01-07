# assetmanager

資産管理アプリ - Asset Management Application

## 概要 (Overview)

資産管理アプリは、個人や組織の資産を管理するためのシンプルなWebアプリケーションです。資産の登録、編集、削除、一覧表示などの基本的な機能を提供します。

This is a simple web application for managing personal or organizational assets. It provides basic features such as registering, editing, deleting, and listing assets.

## 機能 (Features)

- ✅ 資産の登録 (Register assets)
- ✅ 資産の一覧表示 (List all assets)
- ✅ 資産の編集 (Edit assets)
- ✅ 資産の削除 (Delete assets)
- ✅ カテゴリー別管理 (Manage by category)
- ✅ ステータス管理 (Status management)
- ✅ 購入日・価格の記録 (Record purchase date and price)

## 技術スタック (Technology Stack)

- **Backend**: Node.js + Express
- **Database**: SQLite3
- **Frontend**: HTML5 + CSS3 + JavaScript (Vanilla)

## インストール (Installation)

### 必要要件 (Requirements)
- Node.js (v14 以上 / v14 or higher)
- npm (v6 以上 / v6 or higher)

### セットアップ手順 (Setup Instructions)

1. リポジトリをクローンします (Clone the repository):
```bash
git clone https://github.com/takatan11/assetmanager.git
cd assetmanager
```

2. 依存関係をインストールします (Install dependencies):
```bash
npm install
```

3. サーバーを起動します (Start the server):
```bash
npm start
```

4. ブラウザで以下のURLを開きます (Open in browser):
```
http://localhost:3000
```

## 使い方 (Usage)

### 資産の追加 (Adding Assets)

1. 左側のフォームに資産情報を入力します
2. 「資産名」と「カテゴリー」は必須項目です
3. 「追加」ボタンをクリックして保存します

### 資産の編集 (Editing Assets)

1. 右側の資産リストから編集したい資産の「編集」ボタンをクリックします
2. フォームに既存の情報が表示されます
3. 必要な変更を行い、「更新」ボタンをクリックします

### 資産の削除 (Deleting Assets)

1. 右側の資産リストから削除したい資産の「削除」ボタンをクリックします
2. 確認ダイアログで「OK」を選択します

## API エンドポイント (API Endpoints)

- `GET /api/assets` - すべての資産を取得 (Get all assets)
- `GET /api/assets/:id` - 特定の資産を取得 (Get specific asset)
- `POST /api/assets` - 新しい資産を作成 (Create new asset)
- `PUT /api/assets/:id` - 資産を更新 (Update asset)
- `DELETE /api/assets/:id` - 資産を削除 (Delete asset)

## データベース構造 (Database Structure)

```sql
CREATE TABLE assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  purchase_date TEXT,
  purchase_price REAL,
  status TEXT DEFAULT 'active',
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## ライセンス (License)

ISC
