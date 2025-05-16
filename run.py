import uvicorn
import logging
import sys

if __name__ == "__main__":
    try:
        # Настройка логирования
        logging.basicConfig(
            level=logging.DEBUG,
            format='%(levelname)s: %(message)s'
        )
        
        # Запуск сервера
        uvicorn.run(
            "app.main:app",
            host="127.0.0.1",
            port=8000,
            reload=False,
            log_level="debug"
        )
    except Exception as e:
        logging.error(f"Ошибка при запуске сервера: {str(e)}")
        sys.exit(1) 