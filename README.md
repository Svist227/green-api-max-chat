# Minix — Telegram Chat

Веб-клиент Telegram на Next.js и GREEN API.

## Возможности

- Вход по ключам GREEN API и привязка Telegram через QR.
- Чаты, «Избранное» и последние 50 сообщений с разделением по датам.
- Отправка текста с Optimistic UI и получение новых сообщений без перезагрузки.
- Просмотр полученных изображений с подписями.
- Поиск чатов по имени и username, новых контактов — по телефону.
- Поиск по загруженным сообщениям выбранного чата.

## Стек

**Next.js 16 · React 18 · TypeScript · NextAuth.js · TanStack Query · Zustand · Zod · SCSS · Material UI · GREEN API**

## Локальный запуск

Нужны Node.js ≥ 20.9, npm и Telegram-инстанс GREEN API.

```bash
# Клонировать репозиторий и установить зависимости
git clone https://github.com/Svist227/green-api-max-chat.git Chat
cd Chat
npm ci

# Сгенерировать секрет для NEXTAUTH_SECRET
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

Создайте `.env.local` в корне и вставьте сгенерированный секрет:

```dotenv
NEXTAUTH_SECRET=ваш_сгенерированный_секрет
NEXTAUTH_URL=http://localhost:3000
```

```bash
npm run dev       # Запустить приложение
npm run lint      # Проверить код
npm run build     # Собрать приложение
npm run start     # Запустить готовую сборку

git status        # Посмотреть изменения
git pull --ff-only # Получить обновления
```

Откройте [localhost:3000/login](http://localhost:3000/login) и введите ключи инстанса. В GREEN API включите уведомления о входящих и исходящих сообщениях, включая отправленные через API; `webhookUrl` оставьте пустым.

## Структура проекта

```text
src/
├── app/            # Страницы, API-роуты, layout и общие стили
├── assets/fonts/   # Локальные шрифты Manrope
├── components/
│   ├── block/      # Чаты, сообщения, результаты поиска
│   └── layout/     # Панели, переписка и поле ввода
├── constants/      # Адрес GREEN API
├── hooks/          # Загрузка чатов, истории и уведомлений
├── schemas/        # Zod-валидация сообщений
├── services/       # Авторизация и отправка сообщений
├── store/          # Состояние интерфейса и Optimistic UI
├── types/          # Типы чатов и сообщений
└── utils/          # Сессия, cookie и даты
public/             # Иконки интерфейса
```

## Внутренний API

| Метод | Роут | Назначение |
| --- | --- | --- |
| GET / POST | `/api/auth/[...nextauth]` | Авторизация и сессия |
| POST | `/api/test` | Проверка ключей для входа |
| GET | `/api/qr` | QR-код и состояние привязки |
| GET | `/api/chats` | Список чатов |
| POST | `/api/chats` | Поиск контакта по телефону |
| GET | `/api/chats/[chatId]/messages` | Последние 50 сообщений |
| POST | `/api/chats/[chatId]/messages` | Отправка текста |
| GET | `/api/notifications` | Получение уведомления |
| DELETE | `/api/notifications` | Подтверждение обработки уведомления |
| GET | `/api/logout` | Отвязка Telegram-инстанса |
