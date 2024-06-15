import urequests
import json

def get_data_from_server(url):
    try:
        response = urequests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            return None
    except Exception as e:
        print("Error:", e)
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

def get_bonuses_amount(data):
    if data and "amount" in data:
        return data["amount"]
    else:
        print("No 'amount' field in response")
        return None

# Function to verify the token on the server
def verify_token(bearer_token):
    url = "" 
    headers = {"Authorization": f"Bearer {bearer_token}"}
    
    try:
        response = urequests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json().get("valid", False)
        else:
            return False
    except Exception as e:
        print("Error verifying token:", e)
        return False
