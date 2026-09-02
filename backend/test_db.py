import mysql.connector

try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Sushmi@2103",
        database="sentinelai"
    )

    print("✅ Connected successfully!")

    conn.close()

except Exception as e:
    print("❌ Error:", e)