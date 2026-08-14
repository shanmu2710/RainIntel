import oracledb
import os

password = os.environ.get('ORACLE_PASSWORD')

conn = oracledb.connect(user='RAININTEL', password=password, dsn='localhost:1521/XEPDB1')
c = conn.cursor()
c.execute("""
    SELECT r.ROLE_NAME, u.USERNAME, u.EMAIL 
    FROM USERS u 
    JOIN ROLES r ON r.ROLE_ID = u.ROLE_ID
""")
for row in c:
    print(row)
