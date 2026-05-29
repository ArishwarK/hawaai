import json
import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import oracledb
import secrets


app = Flask(__name__)
CORS(app)

# Force oracledb to fetch LOBs (CLOBs) as strings for JSON serialization
oracledb.defaults.fetch_lobs = False

ADMIN_PASSWORD = 'hawaai#2026'

# Oracle DB Config
DB_USER = 'system'
DB_PASSWORD = 'arish2007'
DB_DSN = 'localhost:1521/xe'

# Simple in-memory session storage
ACTIVE_SESSIONS = set()


def get_db_connection():
    try:
        return oracledb.connect(user=DB_USER, password=DB_PASSWORD, dsn=DB_DSN)
    except Exception as e:
        print(f"Database connection failed: {e}")
        return None

def load_reels():
    conn = get_db_connection()
    if not conn: return ["DWyeM0BTA6h", "DWqwIDugU1G", "DRzRwqZAToa", "DQwJY-IAS8D"]
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT reel_id FROM REELS ORDER BY id ASC")
        rows = cursor.fetchall()
        return [row[0] for row in rows]
    except Exception as e:
        print(f"Error loading reels: {e}")
        return []
    finally:
        conn.close()

def save_reels(reels):
    conn = get_db_connection()
    if not conn: return
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM REELS") # Clear old ones
        for reel in reels:
            cursor.execute("INSERT INTO REELS (reel_id) VALUES (:1)", [reel])
        conn.commit()
    except Exception as e:
        print(f"Error saving reels: {e}")
    finally:
        conn.close()

def load_reviews():
    conn = get_db_connection()
    if not conn: return []
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT review_text, reviewer_name, source, review_time, review_timestamp, rating, food_rating, appearance_rating
            FROM REVIEWS ORDER BY id DESC
        """)
        rows = cursor.fetchall()
        reviews = []
        for row in rows:
            reviews.append({
                "text": row[0],
                "name": row[1],
                "source": row[2],
                "time": row[3],
                "timestamp": row[4],
                "rating": row[5],
                "foodRating": row[6],
                "appearanceRating": row[7]
            })
        return reviews
    except Exception as e:
        print(f"Error loading reviews: {e}")
        return []
    finally:
        conn.close()

def save_review(review_dict):
    conn = get_db_connection()
    if not conn: return
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO REVIEWS (review_text, reviewer_name, source, review_time, review_timestamp, rating, food_rating, appearance_rating)
            VALUES (:1, :2, :3, :4, :5, :6, :7, :8)
        """, [
            review_dict.get('text', ''), review_dict.get('name', ''), review_dict.get('source', ''),
            review_dict.get('time', ''), review_dict.get('timestamp', ''),
            review_dict.get('rating', 5), review_dict.get('foodRating', 5), review_dict.get('appearanceRating', 5)
        ])
        conn.commit()
    except Exception as e:
         print(f"Error saving review: {e}")
    finally:
         conn.close()

def load_menu():
    conn = get_db_connection()
    if not conn: return {}
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT cat_id, label, name, image, color FROM MENU_CATEGORIES")
        categories_db = cursor.fetchall()
        
        menu = {}
        for cat in categories_db:
            cat_id, label, name, image, color = cat
            menu[cat_id] = {
                "id": cat_id,
                "label": label,
                "name": name,
                "image": image,
                "color": color,
                "items": []
            }
        
        if menu:
            cursor.execute("SELECT cat_id, name, price, description FROM MENU_ITEMS")
            items_db = cursor.fetchall()
            for item in items_db:
                cat_id, name, price, description = item
                if cat_id in menu:
                    menu[cat_id]["items"].append({
                        "name": name,
                        "price": price,
                        "desc": description
                    })
        return menu
    except Exception as e:
        print(f"Error loading menu: {e}")
        return {}
    finally:
        conn.close()

def save_menu(menu_dict):
    conn = get_db_connection()
    if not conn: return
    try:
        cursor = conn.cursor()
        # Delete old menu to replace entirely as per previous behavior
        cursor.execute("DELETE FROM MENU_CATEGORIES") # cascade should delete items
        
        for k, v in menu_dict.items():
            cursor.execute("""
                INSERT INTO MENU_CATEGORIES (cat_id, label, name, image, color)
                VALUES (:1, :2, :3, :4, :5)
            """, [k, v.get('label', ''), v.get('name', ''), v.get('image', ''), v.get('color', '')])
            
            for item in v.get('items', []):
                 cursor.execute("""
                    INSERT INTO MENU_ITEMS (cat_id, name, price, description)
                    VALUES (:1, :2, :3, :4)
                 """, [k, item.get('name', ''), item.get('price', ''), item.get('desc', '')])
        
        conn.commit()
    except Exception as e:
        print(f"Error saving menu: {e}")
        conn.rollback()
    finally:
        conn.close()


@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    return jsonify(load_reviews())

@app.route('/api/reviews', methods=['POST'])
def add_review():
    data = request.get_json(silent=True) or {}
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400
        
    new_review = {
        "text": data.get('text', ''),
        "name": data.get('name', 'Anonymous'),
        "rating": data.get('rating', 5),
        "foodRating": data.get('foodRating', 5),
        "appearanceRating": data.get('appearanceRating', 5),
        "source": "Recent Review",
        "timestamp": datetime.now().isoformat(),
        "time": "Just now" # Legacy fallback
    }
    save_review(new_review)
    return jsonify(new_review), 201

@app.route('/api/menu', methods=['GET'])
def get_menu():
    return jsonify(load_menu())

@app.route('/api/menu', methods=['POST'])
def update_menu():
    auth_header = request.headers.get('Authorization')
    if auth_header not in ACTIVE_SESSIONS:
        return jsonify({"error": "Unauthorized"}), 401

    
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error": "Invalid data"}), 400
    
    save_menu(data)
    return jsonify({"message": "Menu updated successfully"}), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    password = data.get('password')
    if password == ADMIN_PASSWORD:
        token = secrets.token_hex(24)
        ACTIVE_SESSIONS.add(token)
        return jsonify({"token": token}), 200
    return jsonify({"error": "Invalid password"}), 401

@app.route('/api/verify-auth', methods=['GET'])
def verify_auth():
    token = request.headers.get('Authorization')
    if token and token in ACTIVE_SESSIONS:
        return jsonify({"status": "authenticated"}), 200
    return jsonify({"error": "Unauthorized"}), 401


@app.route('/api/reels', methods=['GET'])
def get_reels():
    return jsonify(load_reels())

@app.route('/api/reels', methods=['POST'])
def update_reels():
    auth_header = request.headers.get('Authorization')
    if auth_header not in ACTIVE_SESSIONS:
        return jsonify({"error": "Unauthorized"}), 401

    
    data = request.get_json(silent=True)
    if not isinstance(data, list):
        return jsonify({"error": "Invalid data format, expected list"}), 400
    
    reels_to_save = list(data)
    save_reels(reels_to_save)
    return jsonify({"message": "Reels updated successfully"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

