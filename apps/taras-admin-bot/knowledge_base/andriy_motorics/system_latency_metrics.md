---
title: "Чисті Метрики, Затримки Системи та Data Motorics"
targetRole: "andryuha"
---

# Motorics and Numbers: Технічний Каркас Екосистеми

Андрію (Neural Nomad), ця база для тебе. Бізнес працює рівно так, як працюють його метрики і моторики. Абсолютний фокус на цифрах. Якщо щось не вимірюється — воно не існує.

## 📡 API та Network Latency
- Регулярний трекінг відгуку Vercel та PM2 серверів (TTFB - Time To First Byte).
- Норма моторики: відповідь системи менше 200 мс. Усе що вище 500 мс — критичне відхилення, яке вбиває конверсію B2C та Telegram-бота. 
- Налаштуй ретельне логування запитів у `logger.js`. Ми повинні знати, на якому вузлі лагає Telegram webhook.

## 🗄️ Database Load & Query Optimization (Database Motorics)
- **Prisma Metrics:** Перевіряй `query_duration` у SQLite/PostgreSQL. Читай індекси таблиць (особливо для унікальних полів типу `notionId` та `telegramId`).
- Якщо база перевантажена вхідними даними з Notion Sync, став черги (Queue/Workers) на бекграунд задачу, щоб не блокувати головний Event Loop у Node.js.

## 📊 Системна Конверсія 
Сприймай код як воронку: 
`Users clicked /start` -> `Users saw tasks` -> `Users completed tasks`. 
Аналізуй ці цифри щотижня і оптимізуй UI (TWA) для підняття залученості команди.
