# YUMA Center API

**YUMA Center** — backend-система на FastAPI для управления проектами, разработчиками, сборками и комментариями к сборкам.

---

## Возможности

- Регистрация разработчиков и проектов
- Загрузка и скачивание сборок
- Оставление комментариев к сборкам
- Получение списка сборок и комментариев
- Асинхронная работа с базой данных (SQLAlchemy)
- Миграции через Alembic
- Удобная документация через Swagger UI

---

## Установка и запуск

1. **Клонируй репозиторий:**
   ```bash
   git clone https://github.com/yourusername/yuma_center.git
   cd yuma_center
   ```

2. **Создай и активируй виртуальное окружение:**
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Linux/Mac:
   source venv/bin/activate
   ```

3. **Установи зависимости:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Применить миграции (создать таблицы):**
   ```bash
   alembic upgrade head
   ```

5. **Запусти сервер:**
   ```bash
   python run.py
   ```
   или
   ```bash
   uvicorn app.main:app --reload
   ```

6. **Открой документацию:**
   - Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## Примеры API

### Регистрация разработчика
`POST /auth/register`
```json
{
  "login": "ayupov",
  "password": "123456",
  "name": "ayupov",
  "project_name": "FastApi"
}
```

### Загрузка сборки
`POST /builds/upload`  
(используй форму: developer_login, version, description, file)

### Получение сборок разработчика
`GET /builds/developer/{developer_id}`

### Скачивание сборки
`GET /builds/download/{developer_id}/{filename}`

### Добавление комментария к сборке
`POST /builds/{build_id}/comments`
```json
{
  "text": "Отличная сборка!",
  "developer_id": 1
}
```

### Получение комментариев к сборке
`GET /builds/{build_id}/comments`

---

## Структура проекта

```
app/
├── routers/         # API endpoints
├── models.py        # SQLAlchemy модели
├── schemas.py       # Pydantic-схемы
├── crub.py          # CRUD-операции
├── database.py      # Настройки базы данных
├── config.py        # Конфиг проекта
├── storage/         # Хранилище файлов (игнорируется git)
├── ...
tests/               # Тесты
run.py               # Запуск сервера
requirements.txt     # Зависимости
```

---

## Технологии

- FastAPI
- SQLAlchemy (async)
- Alembic
- Pydantic
- aiofiles
- Pytest, httpx (тесты)

---

## Переменные окружения
```
DATABASE_URL=sqlite+aiosqlite:///./app.db
