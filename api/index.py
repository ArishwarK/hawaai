# Trigger redeploy

import hashlib
import time
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests as http_requests
from dotenv import load_dotenv

# Load .env file if present
import os


app = Flask(__name__)
CORS(app)

# Configuration from Environment Variables (Stripped of any whitespace)
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'hawaai#2026').strip()
SUPABASE_URL = os.environ.get('SUPABASE_URL', '').strip().rstrip('/')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', '').strip()

# Secure Secret for Stateless Token Signing
SERVER_SECRET = hashlib.sha256(f"{ADMIN_PASSWORD}{SUPABASE_KEY}".encode()).hexdigest()

# ── Supabase Helpers ──

def sb_headers():
    # Prefer service role key for server-side operations if available
    key = os.getenv('SUPABASE_SERVICE_KEY', SUPABASE_KEY).strip()
    return {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }

def sb_get(table, params=None):
    if not SUPABASE_URL or not SUPABASE_KEY: return []
    for _ in range(2): # Simple retry
        try:
            url = f"{SUPABASE_URL}/rest/v1/{table}"
            r = http_requests.get(url, headers=sb_headers(), params=params or {}, timeout=15)
            if r.status_code == 200: return r.json()
        except Exception as e:
            print(f"sb_get {table} error: {e}")
            time.sleep(0.5)
    return []

def sb_post(table, data):
    if not SUPABASE_URL or not SUPABASE_KEY: return False
    try:
        url = f"{SUPABASE_URL}/rest/v1/{table}"
        r = http_requests.post(url, headers=sb_headers(), json=data, timeout=15)
        if r.status_code not in (200, 201, 204):
            print(f"sb_post {table} FAILED: {r.status_code} {r.text}")
        return r.status_code in (200, 201, 204)
    except Exception as e:
        print(f"sb_post {table} error: {e}")
        return False

def sb_delete(table, column, operator, value):
    if not SUPABASE_URL or not SUPABASE_KEY: return False
    try:
        url = f"{SUPABASE_URL}/rest/v1/{table}?{column}={operator}.{value}"
        r = http_requests.delete(url, headers=sb_headers(), timeout=15)
        return r.status_code in (200, 201, 204)
    except Exception as e:
        print(f"sb_delete {table} error: {e}")
        return False

# ── Stateless Auth ──

def generate_token():
    ts = str(int(time.time()))
    sig = hashlib.sha256(f"{ts}{SERVER_SECRET}".encode()).hexdigest()
    return f"{ts}.{sig}"

def is_authenticated():
    raw_token = request.headers.get('Authorization', '')
    # Handle "Bearer <token>" or just "<token>"
    token = raw_token.replace('Bearer ', '').strip()
    
    if not token or "." not in token:
        print(f"DEBUG AUTH: Invalid token format: {token}")
        return False
    try:
        ts, sig = token.split(".", 1)
        # Verify the signature
        expected_sig = hashlib.sha256(f"{ts}{SERVER_SECRET}".encode()).hexdigest()
        if sig != expected_sig:
            print(f"DEBUG AUTH: Signature mismatch. Got {sig}, expected {expected_sig}")
            return False
        # Check expiry (24 hours)
        if abs(int(time.time()) - int(ts)) > 86400:
            print(f"DEBUG AUTH: Token expired. TS: {ts}")
            return False
        return True
    except Exception as e:
        print(f"DEBUG AUTH: Exception during verify: {e}")
        return False

# ── Data Functions ──

def load_reels():
    rows = sb_get('reels', {'select': 'reel_id', 'order': 'id'})
    return [r['reel_id'] for r in rows] if rows else []

def save_reels(reels):
    sb_delete('reels', 'id', 'neq', '-1')
    if reels:
        # We catch any exception in sb_post by modifying it locally just for reels if needed,
        # but let's just use the default and see if it fails.
        res = sb_post('reels', [{"id": i+1, "reel_id": r} for i, r in enumerate(reels)])
        return res
    return True

def load_menu():
    # Fetch categories and items from Supabase
    cats = sb_get('menu_categories', {'select': '*'})
    items = sb_get('menu_items', {'select': '*'})
    print(f"DEBUG: Loaded {len(cats)} categories and {len(items)} items from Supabase")
    menu = {}
    # Build categories dictionary
    for cat in cats:
        c_id = cat['cat_id']
        menu[c_id] = {
            "id": c_id,
            "label": cat.get('label'),
            "name": cat.get('name'),
            "image": cat.get('image'),
            "color": cat.get('color'),
            "items": []
        }
    print(f"DEBUG: Constructed menu dict with {len(menu)} categories")
    # Attach items to appropriate categories
    for item in items:
        c_id = item.get('cat_id')
        if c_id in menu:
            menu[c_id]["items"].append({
                "name": item.get('name'),
                "price": item.get('price'),
                "desc": item.get('description')
            })
    print(f"DEBUG: Final menu has total {sum(len(v['items']) for v in menu.values())} items")
    if not menu:
        # Return a hardcoded sample if Supabase returns no data
        menu = {
            "sample": {
                "id": "sample",
                "label": "Sample Category",
                "name": "Sample Category",
                "image": "https://via.placeholder.com/150",
                "color": "#ff6600",
                "items": [
                    {"name": "Sample Item 1", "price": 5.0, "desc": "Delicious sample item"},
                    {"name": "Sample Item 2", "price": 7.5, "desc": "Another tasty sample"}
                ]
            }
        }
        return menu
    return menu

def save_menu(menu_dict):
    # 1. Prepare bulk data
    all_categories = []
    all_items = []
    
    for k, v in menu_dict.items():
        all_categories.append({
            "cat_id": k, 
            "label": v.get('label'), 
            "name": v.get('name'),
            "image": v.get('image'), 
            "color": v.get('color')
        })
        
        for item in v.get('items', []):
            all_items.append({
                "cat_id": k, 
                "name": item.get('name'), 
                "price": item.get('price'), 
                "description": item.get('desc')
            })
    
    # 2. Execute in bulk (only 4 requests total)
    try:
        # We delete first then post.
        sb_delete('menu_items', 'id', 'neq', '-1')
        sb_delete('menu_categories', 'cat_id', 'neq', 'none')
        
        success = True
        if all_categories:
            if not sb_post('menu_categories', all_categories): success = False
        if all_items:
            if not sb_post('menu_items', all_items): success = False
        
        if not success:
            print("WARNING: Some parts of the menu save failed.")
            return False
        return True
    except Exception as e:
        print(f"CRITICAL ERROR in save_menu: {e}")
        return False

def load_reviews():
    rows = sb_get('reviews', {'select': '*', 'order': 'id.desc'})
    for r in rows:
        # Map DB columns to Frontend keys
        r['name'] = r.get('reviewer_name')
        r['text'] = r.get('review_text')
        r['foodRating'] = r.get('food_rating')
        r['appearanceRating'] = r.get('appearance_rating')
        # Use created_at if review_timestamp is missing
        r['timestamp'] = r.get('review_timestamp')
    return rows

def save_review(data):
    payload = {
        "reviewer_name": data.get('name', 'Anonymous'),
        "review_text": data.get('text', ''),
        "rating": data.get('rating', 5),
        "food_rating": data.get('foodRating', 5),
        "appearance_rating": data.get('appearanceRating', 5),
        "source": "Direct Visit",
        "review_timestamp": datetime.utcnow().isoformat() + 'Z'
    }
    return sb_post('reviews', [payload])

# ── Routes ──

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    password = (data.get('password') or '').strip()
    if password == ADMIN_PASSWORD:
        return jsonify({"token": generate_token()}), 200
    return jsonify({"error": "Invalid password"}), 401

@app.route('/api/verify-auth', methods=['GET'])
def verify_auth():
    if is_authenticated():
        return jsonify({"status": "authenticated"}), 200
    return jsonify({"error": "Unauthorized"}), 401

@app.route('/api/menu', methods=['GET', 'POST'])
def handle_menu():
    if request.method == 'POST':
        if not is_authenticated(): return jsonify({"error": "Unauthorized"}), 401
        data = request.get_json(silent=True)
        if data is None: return jsonify({"error": "Invalid data"}), 400
        save_menu(data)
        return jsonify({"message": "Menu saved"}), 200
    return jsonify(load_menu())

@app.route('/api/reels', methods=['GET', 'POST'])
def handle_reels():
    if request.method == 'POST':
        if not is_authenticated(): return jsonify({"error": "Unauthorized"}), 401
        data = request.get_json(silent=True)
        if not isinstance(data, list): return jsonify({"error": "Invalid data"}), 400
        
        # Manually run save_reels logic and catch errors
        try:
            sb_delete('reels', 'id', 'neq', '-1')
            if data:
                url = f"{SUPABASE_URL}/rest/v1/reels"
                r = http_requests.post(url, headers=sb_headers(), json=[{"reel_id": r} for r in data], timeout=15)
                if r.status_code not in (200, 201, 204):
                    return jsonify({"error": f"Supabase error: {r.status_code} {r.text}"}), 500
            return jsonify({"message": "Reels saved"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
            
    return jsonify(load_reels())

@app.route('/api/reviews', methods=['GET', 'POST'])
def handle_reviews():
    if request.method == 'POST':
        data = request.get_json(silent=True)
        if not data: return jsonify({"error": "No data"}), 400
        if save_review(data):
            return jsonify({"message": "Review saved"}), 201
        return jsonify({"error": "Failed to save review"}), 500
    return jsonify(load_reviews())

@app.route('/api/upload', methods=['POST'])
def handle_upload():
    if not is_authenticated(): return jsonify({"error": "Unauthorized"}), 401
    
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400
        
    # Generate unique filename
    ext = file.filename.rsplit('.', 1)[-1].lower()
    if ext not in ['jpg', 'jpeg', 'png', 'webp', 'gif']:
        return jsonify({"error": "Invalid file type"}), 400
        
    filename = f"{int(time.time())}_{hashlib.md5(file.filename.encode()).hexdigest()[:8]}.{ext}"
    
    # Upload to Supabase Storage API directly
    try:
        url = f"{SUPABASE_URL}/storage/v1/object/menu_images/{filename}"
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": file.content_type or "application/octet-stream"
        }
        r = http_requests.post(url, headers=headers, data=file.read(), timeout=30)
        
        if r.status_code in (200, 201):
            public_url = f"{SUPABASE_URL}/storage/v1/object/public/menu_images/{filename}"
            return jsonify({"url": public_url}), 200
        else:
            error_msg = r.json().get('message', 'Failed to upload to storage') if r.text else 'Failed to upload to storage'
            print(f"Supabase Output: {r.status_code} {r.text}")
            return jsonify({"error": f"Upload error: {error_msg}"}), 500
    except Exception as e:
        print(f"Upload error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/debug', methods=['GET'])
def debug_endpoint():
    # Return environment variables and a quick menu fetch status
    env_info = {
        'SUPABASE_URL': os.getenv('SUPABASE_URL', ''),
        'SUPABASE_KEY': os.getenv('SUPABASE_KEY', ''),
        'ADMIN_PASSWORD': os.getenv('ADMIN_PASSWORD', '')
    }
    menu = load_menu()
    # If menu contains error key, forward it
    if isinstance(menu, dict) and 'error' in menu:
        return jsonify({
            'env': env_info,
            'menu_error': menu['error']
        })
    # Count categories and items
    cat_count = len(menu)
    item_count = sum(len(v.get('items', [])) for v in menu.values())
    return jsonify({
        'env': env_info,
        'categories': cat_count,
        'items': item_count,
        'menu_sample': list(menu.keys())[:3]
    })


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "online",
        "auth": "stateless-v2",
        "time": int(time.time())
    })

if __name__ == '__main__':
    # Vercel provides the PORT env variable for the serverless function
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

