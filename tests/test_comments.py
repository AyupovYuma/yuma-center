import pytest
import random

@pytest.mark.asyncio
async def test_add_and_get_comment(async_client):
    login = f"testdev{random.randint(1000, 9999)}"
    project_name = f"Test Project {random.randint(1000, 9999)}"
    # Зарегистрировать пользователя
    response = await async_client.post(
        "/auth/register",
        json={
            "login": login,
            "password": "testpass",
            "name": "Test Developer",
            "project_name": project_name
        }
    )
    assert response.status_code == 200
    developer = response.json()
    developer_id = developer["id"]

    # Загрузить сборку
    response = await async_client.post(
        "/builds/upload",
        data={
            "developer_login": login,
            "version": "1.0.0",
            "description": "Test build"
        },
        files={"file": ("testfile2.txt", b"test content")}
    )
    assert response.status_code == 200
    build = response.json()
    build_id = build["id"]

    # Добавить комментарий
    response = await async_client.post(
        f"/builds/{build_id}/comments",
        json={"text": "Отличная сборка!", "developer_id": developer_id}
    )
    if response.status_code != 200:
        print("Ошибка добавления комментария:", response.text)
    assert response.status_code == 200
    comment = response.json()
    assert comment["text"] == "Отличная сборка!"

    # Получить комментарии
    response = await async_client.get(f"/builds/{build_id}/comments")
    if response.status_code != 200:
        print("Ошибка получения комментариев:", response.text)
    assert response.status_code == 200
    comments = response.json()
    assert any(c["text"] == "Отличная сборка!" for c in comments)