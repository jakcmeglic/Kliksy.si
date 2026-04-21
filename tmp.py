import urllib.request
import urllib.parse
import os
import json
import base64

api_key = os.environ.get('CEBELCA_API_KEY')
url = 'https://www.cebelca.biz/API'
req_data = [{"_r": "partner", "_m": "select"}]
data = urllib.parse.urlencode({'req': json.dumps(req_data)}).encode('utf-8')

req = urllib.request.Request(url, data=data)
base64string = base64.b64encode(f"{api_key}:x".encode('utf-8')).decode('ascii')
req.add_header("Authorization", f"Basic {base64string}")

try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode('utf-8'))
except Exception as e:
    print(e.read().decode('utf-8'))
