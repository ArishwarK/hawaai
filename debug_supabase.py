"""Direct Supabase diagnostic with correct key"""
import requests

SUPABASE_URL = "https://ycgktkdudxazftqbizlw.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljZ2t0a2R1ZHhhemZ0cWJpemx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxOTg0NDgsImV4cCI6MjA5Mjc3NDQ0OH0.rGqAHDDT9lIwckhMJwPaJHwRlXE4tsFlowNVXsrETls"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

print("--- menu_categories ---")
r = requests.get(f"{SUPABASE_URL}/rest/v1/menu_categories?select=*", headers=headers, timeout=15)
print(f"Status: {r.status_code}")
print(f"Response: {r.text[:500]}")

print("\n--- menu_items ---")
r = requests.get(f"{SUPABASE_URL}/rest/v1/menu_items?select=*", headers=headers, timeout=15)
print(f"Status: {r.status_code}")
print(f"Response: {r.text[:500]}")
