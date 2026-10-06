# M96 frontend

Самостоятельный React/TypeScript-сервис с nginx. В этой папке нет Go-процесса. Nginx проксирует `/api/`, `/uploads/`, `/healthz` и SEO-маршруты на отдельный Go API.

## Docker на отдельном сервере

```bash
cp .env.example .env
# Замените BACKEND_URL на реальный публичный HTTPS-адрес Go API.
docker compose -f compose.yml up --build -d
```

Указывайте `BACKEND_URL=https://api.example.com` без `/api`. Внешний порт задаёт `FRONTEND_PUBLIC_PORT` (по умолчанию 80), внутренний nginx слушает `PORT=80`. Если хостинг автоматически назначает другой внутренний порт, поменяйте `PORT` и отображение порта в compose. Для публичного доступа включите HTTPS перед frontend. Браузеру известен только адрес frontend; отдельный CORS на Go не требуется. Пароль админки сюда не копируется: он задан как `ADMIN_TOKEN` на Go-сервере.

Для локальной разработки: `npm ci && npm run dev`, затем настройте `BACKEND_URL` на адрес локального API в `.env.local`.
