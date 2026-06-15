import oracledb
import json
import os

DB_USER = 'system'
DB_PASSWORD = 'arish2007'
DB_DSN = 'localhost:1521/xe' 

def init_db():
    print("Connecting to Oracle DB...")
    try:
        connection = oracledb.connect(user=DB_USER, password=DB_PASSWORD, dsn=DB_DSN)
        cursor = connection.cursor()
        print("Connected successfully.")

        # 1. REELS Table
        print("Ensuring REELS table exists...")
        try:
            cursor.execute("""
                CREATE TABLE REELS (
                    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    reel_id VARCHAR2(255) NOT NULL
                )
            """)
            print("Created REELS table.")
        except oracledb.DatabaseError as e:
            error, = e.args
            if error.code == 955: print("REELS table already exists.")
            else: raise

        # Seed REELS if empty
        cursor.execute("SELECT count(*) FROM REELS")
        if cursor.fetchone()[0] == 0:
            print("Seeding REELS...")
            default_reels = ["DWyeM0BTA6h", "DWqwIDugU1G", "DRzRwqZAToa", "DQwJY-IAS8D"]
            for reel in default_reels:
                cursor.execute("INSERT INTO REELS (reel_id) VALUES (:1)", [reel])
            connection.commit()
            print("REELS seeded.")

        # 2. REVIEWS Table
        print("Ensuring REVIEWS table exists...")
        try:
            cursor.execute("""
                CREATE TABLE REVIEWS (
                    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    review_text CLOB,
                    reviewer_name VARCHAR2(255),
                    source VARCHAR2(255),
                    review_time VARCHAR2(255),
                    review_timestamp VARCHAR2(255),
                    rating NUMBER,
                    food_rating NUMBER,
                    appearance_rating NUMBER
                )
            """)
            print("Created REVIEWS table.")
        except oracledb.DatabaseError as e:
            error, = e.args
            if error.code == 955: print("REVIEWS table already exists.")
            else: raise

        # Seed REVIEWS if empty
        cursor.execute("SELECT count(*) FROM REVIEWS")
        if cursor.fetchone()[0] == 0:
            print("No reviews to seed by default.")

        # 3. MENU_CATEGORIES Table
        print("Ensuring MENU tables exist...")
        try:
            cursor.execute("""
                CREATE TABLE MENU_CATEGORIES (
                    cat_id VARCHAR2(255) PRIMARY KEY,
                    label VARCHAR2(255),
                    name VARCHAR2(255),
                    image VARCHAR2(1000),
                    color VARCHAR2(50),
                    sort_order NUMBER DEFAULT 0
                )
            """)
            print("Created MENU_CATEGORIES table.")
            cursor.execute("""
                CREATE TABLE MENU_ITEMS (
                    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    cat_id VARCHAR2(255) REFERENCES MENU_CATEGORIES(cat_id) ON DELETE CASCADE,
                    name VARCHAR2(255),
                    price VARCHAR2(50),
                    description CLOB
                )
            """)
            print("Created MENU_ITEMS table.")
        except oracledb.DatabaseError as e:
            error, = e.args
            if error.code == 955: print("MENU tables already exist.")
            else: raise

        # Migration: add sort_order column if it doesn't exist yet
        try:
            cursor.execute("ALTER TABLE MENU_CATEGORIES ADD sort_order NUMBER DEFAULT 0")
            connection.commit()
            print("Added sort_order column to MENU_CATEGORIES.")
        except oracledb.DatabaseError as e:
            error, = e.args
            if error.code == 1430: print("sort_order column already exists.")  # ORA-01430: column already exists
            else: raise

        # Seed MENU if empty
        cursor.execute("SELECT count(*) FROM MENU_CATEGORIES")
        if cursor.fetchone()[0] == 0:
            print("No menu items to seed by default.")
                 
        cursor.close()
        connection.close()
        print("Database initialization complete.")

    except Exception as e:
        print(f"Failed to initialize database: {e}")

if __name__ == '__main__':
    init_db()
