import requests
import sqlite3
import os

def load_env():
    with open('../.env', 'r') as file:
        for line in file:
            if '=' in line:
                key, value = line.strip().split('=', 1)
                os.environ[key] = value

load_env()

CLIENT_ID = os.getenv('WOW_CLIENT_ID')
CLIENT_SECRET = os.getenv('WOW_SECRET_KEY')
REGION = 'eu'  # Use 'eu', 'us', etc., as appropriate
LOCALE = 'en_US'

def get_access_token(client_id, client_secret):
    url = f"https://{REGION}.battle.net/oauth/token"
    auth = (client_id, client_secret)
    data = {'grant_type': 'client_credentials'}
    response = requests.post(url, data=data, auth=auth)
    if response.status_code == 200:
        return response.json()['access_token']
    else:
        print(f"Failed to get access token: {response.status_code}, {response.text}")
        return None

def fetch_item_details(access_token, item_id):
    url = f"https://{REGION}.api.blizzard.com/data/wow/item/{item_id}?namespace=static-{REGION}&locale={LOCALE}&access_token={access_token}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        name = data.get('name')
        rarity = data.get('quality', {}).get('type')
        return name, rarity
    else:
        print(f"Failed to fetch item {item_id}: {response.status_code}")
        return None, None
    
conn = sqlite3.connect('prices.db')
cursor = conn.cursor()

# Add the itemRarity column if it does not exist
cursor.execute('PRAGMA table_info(items)')
columns = [info[1] for info in cursor.fetchall()]
if 'itemRarity' not in columns:
    cursor.execute('ALTER TABLE items ADD COLUMN itemRarity TEXT')

cursor.execute('''
CREATE TABLE IF NOT EXISTS items (
    itemId INTEGER PRIMARY KEY,
    itemName TEXT
    itemRarity TEXT
)
''')

cursor.execute('SELECT DISTINCT itemId FROM prices_history WHERE itemId NOT IN (SELECT itemId FROM items)')
item_ids = [row[0] for row in cursor.fetchall()]

# access_token = get_access_token(CLIENT_ID, CLIENT_SECRET)
# hardcoded for now
access_token = ''

for item_id in item_ids:
    item_name, item_rarity = fetch_item_details(access_token, item_id)
    if item_name and item_rarity:
        cursor.execute('INSERT OR IGNORE INTO items (itemId, itemName, itemRarity) VALUES (?, ?, ?)', (item_id, item_name, item_rarity))
        print(f"Inserted: Item ID {item_id} - Name: {item_name}, Rarity: {item_rarity}")
        conn.commit()

conn.close()
print('Item names inserted/updated successfully.')
