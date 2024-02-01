import sqlite3
import json
from datetime import datetime

# Load JSON data from file
with open('res.json', 'r') as file:
    data = json.load(file)

# Connect to the SQLite database
conn = sqlite3.connect('database/prices.db')
cursor = conn.cursor()

# Create table if it does not exist, adding a 'snapshotDate' column for tracking changes over time
cursor.execute('''
CREATE TABLE IF NOT EXISTS prices_history (
    auctionHouseId INTEGER,
    itemId INTEGER,
    petSpeciesId INTEGER,
    minBuyout INTEGER,
    quantity INTEGER,
    marketValue INTEGER,
    historical INTEGER,
    numAuctions INTEGER,
    snapshotDate TEXT,
    PRIMARY KEY (itemId, snapshotDate)
)
''')

# Insert data into the table with current timestamp
current_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
for item in data:
    item['snapshotDate'] = current_date  # Add snapshot date to each item
    placeholders = ', '.join(['?'] * len(item))
    columns = ', '.join(item.keys())
    sql = f'INSERT INTO prices_history ({columns}) VALUES ({placeholders})'
    cursor.execute(sql, list(item.values()))

# Commit the changes and close the connection
conn.commit()
conn.close()

print('Data inserted successfully with timestamps.')
