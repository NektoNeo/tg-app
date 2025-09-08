# VA-PC Telegram Mini App

Telegram Mini App для магазина компьютеров VA-PC с интеграцией VK Market API для актуальных цен и ассортимента.

## 🚀 Функциональность

- 📱 **Telegram Mini App** - полная интеграция с Telegram WebApp SDK
- 🛍️ **Каталог товаров** - синхронизация с VK Market API
- 💰 **Динамическое ценообразование** - конфигуратор RAM/SSD с автоматическим пересчетом
- 🛒 **Корзина и оформление заказа** - с уведомлениями в Telegram
- 👨‍💼 **Админ-панель** - управление заказами и товарами
- 🎨 **Современный дизайн** - фиолетовая тема VA-PC с анимациями

## 📋 Требования

- Node.js >= 18.0.0
- npm >= 9.0.0
- Telegram Bot (для уведомлений)
- VK Market API токен (для синхронизации товаров)

## 🛠️ Установка

### 1. Клонирование репозитория

```bash
git clone https://github.com/yourusername/tg-app.git
cd tg-app
```

### 2. Установка зависимостей

```bash
# Установка всех зависимостей (frontend и backend)
npm install
```

### 3. Настройка переменных окружения

#### Backend (.env)

```bash
cd backend
cp .env.example .env
```

Отредактируйте `backend/.env`:

```env
# Обязательные параметры
VK_MARKET_ACCESS_TOKEN=ваш_токен_vk_api
VK_MARKET_GROUP_ID=id_вашей_группы_vk
TELEGRAM_BOT_TOKEN=токен_вашего_бота
TELEGRAM_ADMIN_CHAT_ID=id_чата_для_уведомлений
JWT_SECRET=секретный_ключ_для_jwt
```

#### Frontend (.env)

```bash
cd ../frontend
cp .env.example .env
```

Отредактируйте `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001/api
VITE_TELEGRAM_BOT_USERNAME=ваш_бот_username
```

## 🚀 Запуск в режиме разработки

```bash
# Из корневой директории проекта
npm run dev

# Или запустить отдельно:
# Backend (порт 3001)
cd backend && npm run dev

# Frontend (порт 5173)
cd frontend && npm run dev
```

## 📦 Сборка для продакшена

```bash
# Сборка обоих проектов
npm run build

# Или отдельно:
cd backend && npm run build
cd frontend && npm run build
```

## 🌐 Деплой на Beget

### 1. Подготовка сервера

1. Создайте Node.js сайт в панели Beget
2. Установите Node.js версии 18 или выше
3. Настройте SSL сертификат (обязательно для Telegram Mini Apps)

### 2. Загрузка файлов

```bash
# Сборка проекта
npm run build

# Архивирование для загрузки
tar -czf tg-app.tar.gz \
  backend/dist \
  backend/package*.json \
  frontend/dist \
  package*.json
```

### 3. Настройка на сервере

SSH подключение к серверу:

```bash
ssh user@your-server.beget.com

# Распаковка архива
tar -xzf tg-app.tar.gz

# Установка зависимостей
npm install --production

# Настройка PM2
npm install -g pm2
pm2 start backend/dist/index.js --name va-pc-api
pm2 save
pm2 startup
```

### 4. Настройка Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🤖 Настройка Telegram Bot

1. Создайте бота через [@BotFather](https://t.me/botfather)
2. Получите токен бота
3. Настройте Web App:
   ```
   /setmenubutton - установите кнопку "Открыть магазин"
   /setwebapp - укажите URL вашего приложения
   ```

## 📊 Настройка VK Market API

1. Создайте приложение VK: https://vk.com/apps?act=manage
2. Получите токен доступа с правами `market`
3. Узнайте ID вашей группы VK

## 🔧 Полезные команды

```bash
# Проверка TypeScript
npm run type-check

# Линтинг
npm run lint

# Тесты (если добавлены)
npm run test

# Очистка кэша VK Market
curl -X POST http://localhost:3001/api/products/sync
```

## 📱 Тестирование в Telegram

1. Откройте вашего бота в Telegram
2. Нажмите кнопку "Открыть магазин"
3. Приложение откроется в Telegram WebView

### Режим разработки на мобильном

Используйте [ngrok](https://ngrok.com/) для тестирования:

```bash
# Установка ngrok
npm install -g ngrok

# Запуск туннеля
ngrok http 5173

# Используйте полученный HTTPS URL в настройках бота
```

## 🏗️ Структура проекта

```
tg-app/
├── frontend/               # React приложение
│   ├── src/
│   │   ├── components/    # UI компоненты
│   │   ├── pages/        # Страницы приложения
│   │   ├── services/     # API сервисы
│   │   ├── store/        # Zustand store
│   │   └── hooks/        # React hooks
│   └── dist/             # Собранное приложение
├── backend/               # Node.js сервер
│   ├── src/
│   │   ├── routes/       # API маршруты
│   │   ├── services/     # Бизнес-логика
│   │   └── utils/        # Утилиты
│   └── dist/             # Собранный сервер
└── package.json          # Корневые зависимости
```

## 🔒 Безопасность

- Используйте HTTPS для продакшена (обязательно для Telegram Mini Apps)
- Храните секретные ключи в переменных окружения
- Регулярно обновляйте зависимости
- Используйте rate limiting для API

## 📝 Лицензия

MIT

## 🤝 Поддержка

- Telegram: @your_support_channel
- Email: support@va-pc.ru

---

Разработано с 💜 для VA-PC