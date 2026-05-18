import requests

try:
    res = requests.get("http://127.0.0.1:8000/followup-calls/all-followups")
    print("Status Code:", res.status_code)
    data = res.json()
    for f in data:
        print("f keys:", f.keys())
        print("f:", {k: f[k] for k in ["id", "lead_id", "client_name", "lead_type"]})
except Exception as e:
    print("Error:", e)
