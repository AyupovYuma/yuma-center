from pathlib import Path

def create_dev_folder(project_name: str, login: str) -> str:
    base_path = Path('storage') / project_name / login
    base_path.mkdir(parents=True, exist_ok=True)
    return str(base_path)