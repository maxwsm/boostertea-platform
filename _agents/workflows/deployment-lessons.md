---
description: Zero-Downtime VDS Deployment & Next.js Clone Synchronization Lessons
---

# Mega-Audit Deployment & Synchronization Lessons

Під час масового оновлення платформи (переведення 4 клонів на App Router, PostgreSQL та TurboRepo) ми зафіксували кілька критичних патернів. Цей файл є архітектурною пам'яттю для майбутніх деплоїв BoosterTea OS.

## 1. Колізія Портів При Гібридному Деплої (Docker + PM2)
**Проблема:** При піднятті `wsm-boostertea` через `docker-compose up -d --build`, Docker Engine повертав помилку `failed to bind host port 0.0.0.0:3001/tcp: address already in use`.
**Причина:** Попередній екземпляр бекенду працював через PM2 без контейнера, і продовжував тримати TCP порт 3001.
**Рішення:** 
Завжди примусово звільняти порти перед переходом на Docker-оркестрацію:
```bash
fuser -k 3001/tcp  # жорстко обриває процес на порту
docker compose up -d
```

## 2. Git Synchronization на "Голих" (Raw) Директоріях
**Проблема:** Виклик `git pull origin main` на VDS падав з помилкою `fatal: not a git repository`, оскільки код туди заливався напряму по `scp/rsync` без `.git/` папки.
**Рішення:** Замість того щоб видаляти всю директорію і робити `clone` (що вб'є локальні `.env` файли):
```bash
git init
git remote add origin https://github.com/maxwsm/boostertea-platform.git
git fetch --all
git reset --hard origin/main
```
Це накладе стан `main` поверх існуючих файлів, але не зачепить `untracked` файли типу `.env.local` чи `node_modules/`.

## 3. Захист Git `safe.directory`
**Проблема:** `fatal: detected dubious ownership in repository`. Якщо власник папки `/root/wsm-ecosystem` і користувач, що запускає `git` відрізняються (наприклад, `root` vs `www-data`), `git` блокує виконання для безпеки.
**Рішення:** Додати папку в список дозволених:
```bash
git config --global --add safe.directory /root/wsm-ecosystem
```

## 4. Блокування Комітів Github Privacy (GH007)
**Проблема:** GitHub відхилив `git push` через те, що локальний email Макса публікувався в публічно-видимому коміті.
**Рішення:** Змінити email локально на `noreply` та переставити автора коміту:
```bash
git config user.email "maxwsm@users.noreply.github.com"
git commit --amend --no-edit --reset-author
git push origin main
```

## 5. Security: Hardcoded Fallback Auth Escalation
**Проблема:** У `auth.tsx` під час переходу сервера в offline, fallback-модуль на фронтенді жорстко перевіряв `email === 'admin@boostertea.com.ua'`, даючи статус `isAdmin: true`.
**Рішення:** Будь-який хардкод доступу на клієнті – вразливість. При відключеному бекенді fallback повинен давати `isAdmin: false` незалежно від email-у. Ролі перевіряємо виключно на сервері по JWT через middleware.
