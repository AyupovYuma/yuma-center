@pytest.mark.asyncio
async def test_upload_build(async_client):
    # Зарегистрировать пользователя
    response = await async_client.post(
        "/auth/register",
        json={
            "login": "testdev",
            "password": "testpass",
            "name": "Test Developer",
            "project_name": "Test Project"
        }
    )
    # Не падаем, если пользователь уже есть (например, если тесты не изолированы)
    if response.status_code not in (200, 400):
        print("Ошибка регистрации:", response.text)
    # Далее — загрузка сборки
    response = await async_client.post(
        "/builds/upload",
        data={
            "developer_login": "testdev",
            "version": "1.0.0",
            "description": "Test build"
        },
        files={"file": ("testfile.txt", b"test content")}
    )
    if response.status_code != 200:
        print("Ошибка загрузки сборки:", response.text)
    assert response.status_code == 200
    data = response.json()
    assert data["version"] == "1.0.0"
    assert data["description"] == "Test build"