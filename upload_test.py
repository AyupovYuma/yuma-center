import requests

url = "http://127.0.0.1:8000/builds/upload"
files = {
    'file': ('test_build.zip', open('test_build.zip', 'rb'), 'application/zip')
}
data = {
    'developer_login': 'testdev2',
    'version': '1.0.0',
    'description': 'Test build upload'
}

response = requests.post(url, files=files, data=data)
print("Status code:", response.status_code)
print("Response text:", response.text)
try:
    print("Response JSON:", response.json())
except:
    print("Could not parse JSON response") 