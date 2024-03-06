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
REGION = 'eu'
LOCALE = 'en_US'

def get_access_token(client_id, client_secret):
    url = f"https://{REGION}.battle.net/oauth/token"
    auth = (client_id, client_secret)
    data = {'grant_type': 'client_credentials'}
    response = requests.post(url, data=data, auth=auth)
    return response.json().get('access_token') if response.status_code == 200 else None

def fetch_item_details(access_token, item_id):
    item_url = f"https://{REGION}.api.blizzard.com/data/wow/item/{item_id}?namespace=static-{REGION}&locale={LOCALE}&access_token={access_token}"
    media_url = f"https://{REGION}.api.blizzard.com/data/wow/media/item/{item_id}?namespace=static-{REGION}&locale={LOCALE}&access_token={access_token}"

    item_response = requests.get(item_url)
    media_response = requests.get(media_url)

    if item_response.status_code == 200 and media_response.status_code == 200:
        item_data = item_response.json()
        media_data = media_response.json()
        
        name = item_data.get('name')
        rarity = item_data.get('quality', {}).get('type')
        media = media_data.get('assets', [{}])[0].get('value')

        return name, rarity, media
    else:
        print(f"Failed to fetch item {item_id}: {item_response.status_code}, {media_response.status_code}")
        return None, None, None
    
conn = sqlite3.connect('prices.db')
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS items (
    itemId INTEGER PRIMARY KEY,
    itemName TEXT,
    itemRarity TEXT,
    mediaUrl TEXT
)
''')

cursor.execute('SELECT DISTINCT itemId FROM prices_history WHERE itemId NOT IN (SELECT itemId FROM items)')
item_ids = [row[0] for row in cursor.fetchall()]

access_token = get_access_token(CLIENT_ID, CLIENT_SECRET)

for item_id in item_ids:
    item_name, item_rarity, media_url = fetch_item_details(access_token, item_id)
    print(f"Fetched: Item ID {item_id} - Name: {item_name}, Rarity: {item_rarity}, Media: {media_url}")  # Debug print
    if item_name and item_rarity:
        cursor.execute('INSERT OR IGNORE INTO items (itemId, itemName, itemRarity, mediaUrl) VALUES (?, ?, ?, ?)', (item_id, item_name, item_rarity, media_url))
        conn.commit()

conn.close()
print('Item details and media URLs inserted/updated successfully.')
