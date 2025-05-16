# YUMA Center API

Система управления сборками для разработчиков.

## Функциональность

- Регистрация разработчиков
- Загрузка сборок
- Скачивание сборок
- Управление проектами

## Установка

1. Клонировать репозиторий
2. Создать виртуальное окружение:
```bash
python -m venv venv
```
3. Активировать виртуальное окружение:
```bash
# Windows
.\venv\Scripts\activate
# Linux/MacOS
source venv/bin/activate
```
4. Установить зависимости:
```bash
pip install -r requirements.txt
```
5. Применить миграции:
```bash
alembic upgrade head
```
6. Запустить сервер:
```bash
python run.py
```

## API Endpoints

### Auth

- POST `/auth/register` - Регистрация нового разработчика

### Builds

- POST `/builds/upload` - Загрузка новой сборки
- GET `/builds/developer/{developer_id}` - Получение списка сборок разработчика
- GET `/builds/download/{developer_id}/{filename}` - Скачивание сборки

## Разработка

### Структура проекта

```
app/
├── db/              - База данных
├── routers/         - API endpoints
├── services/        - Бизнес-логика
├── models/          - Модели данных
└── storage/         - Хранилище файлов
```

### Технологии

- FastAPI
- SQLAlchemy
- Alembic
- Pydantic
- aiofiles 