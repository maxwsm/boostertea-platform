---
description: [WSM Native Notion & Miro Clones (Knowledge Flow Engine)]
---

# 🧠 WSM Native Notion & Miro Cloning Protocol

*Суть підходу: Ми не робимо iframe-вставки Notion. Ми крадемо їх головну моторику (Block-based Editor) і (Infinite Canvas) прямо у WSM Master Dashboard, отримуючи повний контроль.*

## 1. Native Notion (Block-Protocol RAG Base)
- **Editor.js / Tiptap / Prosemirror**: Впровадження блочного редактора, де `/` відкриває меню, як у Notion. Якщо ви вводите `/database`, ви можете прикріпити ТТН (Нова Пошта) прямо у текст SOP (інструкції для баристи).
- **Knowledge Base RAG**: Весь створений контент індексується `pgvector` у Prisma. Бот (Gemini) має доступ до цієї внутрішньої "Notion-Бази", тому якщо бариста або ділер пише "Як збити мілкшейк DinoSlush", бот знайде цей блок і віддасть точну цитату. 
- **Nested Workspaces**: Робочі простори, ізольовані на рівні Database Row-Level-Security, дозволяють кожному B2B франчайзі мати свою внутрішню документацію всередині Master Dashboard (Whitelabel Knowledge Base).

## 2. Native Miro (Infinite 2D/3D Canvas)
- **Tldraw / React Flow / React Three Fiber Canvas**: Для побудови воронки продажів (Orchestrator CRM) або графіку виробництва ми використовуємо React Flow або Tldraw.
- **Drag & Drop Взаємодія**: Зліва - список ордерів (`Order`), справа - машина виробництва (`StockPick`). Користувач перетягує замовлення із зони "Sale" у лінію виробництва на безмежному Canvas (Infinite Grid Board). 
- **Колаборація**: Вебсокети (Yjs / Partykit / Socket.io) дозволяють вам і бухгалтеру бачити курсори один одного онлайн, як у Figma/Miro, але ви тягаєте не стікери, ви тягаєте **Справжні дані з бази (Ордери, Лідів)**. Це змінює модель даних Odoo!
