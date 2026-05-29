import oracledb

DB_USER = 'system'
DB_PASSWORD = 'arish2007'
DB_DSN = 'localhost:1521/xe'

def clear_reviews():
    print("Connecting to Oracle DB...")
    try:
        connection = oracledb.connect(user=DB_USER, password=DB_PASSWORD, dsn=DB_DSN)
        cursor = connection.cursor()
        print("Connected. Deleting reviews...")
        cursor.execute("DELETE FROM REVIEWS")
        connection.commit()
        print("All manual reviews deleted successfully!")
        cursor.close()
        connection.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    clear_reviews()
