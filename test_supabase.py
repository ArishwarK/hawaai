import os
import requests

from dotenv import load_dotenv
load_dotenv()

SUPABASE_URL = os.environ.get('SUPABASE_URL', '').strip().rstrip('/')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', '').strip()

headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}'
}

r = requests.get(f"{SUPABASE_URL}/rest/v1/menu_categories?select=*&limit=1", headers=headers)
print(r.json())
