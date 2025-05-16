from logging.config import fileConfig
from sqlalchemy.ext.asyncio import async_engine_from_config
from sqlalchemy import pool
from alembic import context

from app.database import Base
from app import models  # <-- нужно, чтобы Alembic видел модели

import asyncio

# Alembic config
config = context.config

# Логирование
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Метаданные для автогенерации миграций
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Offline-режим (без подключения к БД)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        def do_migrations(sync_connection):
            context.configure(
                connection=sync_connection,
                target_metadata=Base.metadata  # или твоя метадата
            )
            with context.begin_transaction():
                context.run_migrations()

        await connection.run_sync(do_migrations)


if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
