'''Бизнес-логика работы с файлами и БД'''

from pathlib import Path
import aiofiles
from fastapi import UploadFile
from app.crub import create_build
from app.models import Build


async def save_uploaded_file(
        file: UploadFile,
        project_id: int,
        developer_login: str,
        version: str
) -> str:
    # Создаем структуру папок: projects/{project_id}/{developer_login}/
    upload_dir = Path(f"projects/{project_id}/{developer_login}")
    upload_dir.mkdir(parents=True, exist_ok=True)

    # Сохраняем файл с версией в имени
    file_path = upload_dir / f"{version}_{file.filename}"

    # Записываем содержимое файла
    with file_path.open("wb") as buffer:
        buffer.write(await file.read())

    return str(file_path)


async def register_build_in_db(db,
                               developer_id: int,
                               version: str,
                               description: str,
                               filename: str,
                               file_path: str,
                               project_id: int
                               ):
    build_data = {
        'developer_id': developer_id,
        'version': version,
        'description': description,
        'filename': filename,
        'project_id': project_id,
        'file_path': file_path
    }
    return await create_build(db, build_data)
