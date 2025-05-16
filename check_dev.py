import requests

url = "http://127.0.0.1:8000/auth/register"
data = {
    "name": "Test Developer 2",
    "login": "testdev2",
    "password": "testpass123",
    "project_name": "Test Project 2"
}

response = requests.post(url, json=data)
print("Registration response:", response.status_code)
print(response.json()) 