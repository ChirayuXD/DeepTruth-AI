import requests

def upload_to_ipfs(file_path):
    url = "http://127.0.0.1:5001/api/v0/add"

    with open(file_path, "rb") as f:
        files = {"file": f}

        response = requests.post(url, files=files)
        response.raise_for_status()

        return response.json()["Hash"]
