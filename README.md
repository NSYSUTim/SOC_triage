# SOC Triage 自動化系統 - 前端 Demo

> 資安事件自動分流與優先排序系統的前端展示介面

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)

## 🎯 專案簡介

本專案為 SOC (Security Operations Center) Triage 自動化系統的前端 Demo，模擬業界 SIEM Incident Review 介面，展示：

- **DeepCASE** 事件序列關聯分群
- **TEQ** 可行動性/優先級排序
- **LLM** 自動化分析回報

## 🖥️ Demo 頁面

| 頁面 | 功能 |
|------|------|
| Dashboard | 統計總覽、Top 5 待處理 |
| Incidents | 清單排序、篩選、Top-K |
| Incident Detail | 詳情、時間線、LLM 回報 |

## 🚀 快速開始

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build
```

開啟 http://localhost:5173 查看

## 📁 專案結構

```
src/
├── types/          # TypeScript 型別定義
├── mocks/          # Mock 資料
├── components/     # 可重用元件
├── pages/          # 頁面
├── App.tsx         # 主程式 + 路由
└── index.css       # 全域樣式
```

## 🛠️ 技術棧

- **React 18** + **TypeScript**
- **Vite** 建置工具
- **React Router** 路由
- **Lucide React** 圖示

## 📝 開發狀態

- ✅ 基礎架構與路由
- ✅ Incident 清單頁 (排序/篩選/Top-K)
- ✅ Incident 詳情頁 (時間線/LLM 回報)
- ✅ Dashboard 儀表板
- ⬜ Entity Graph 溯源圖 (vis-network)
- ⬜ 後端 API 整合

## 📄 License

MIT
