import urequests
import json

def get_data_from_server(url):
    response = urequests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return None

def post_data_to_server(url, data):
    headers = {
        'Content-Type': 'application/json'
    }
    response = urequests.post(url, data=json.dumps(data), headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        return None

def put_data_to_server(url, data):
    headers = {
        'Content-Type': 'application/json'
    }
    response = urequests.put(url, data=json.dumps(data), headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        return None

def patch_data_to_server(url, data):
    headers = {
        'Content-Type': 'application/json'
    }
    response = urequests.patch(url, data=json.dumps(data), headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        return None
