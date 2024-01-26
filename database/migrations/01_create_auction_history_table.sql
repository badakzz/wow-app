CREATE TABLE auction_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    regionId INTEGER,
    itemId INTEGER,
    petSpeciesId INTEGER,
    marketValue INTEGER,
    quantity INTEGER,
    historical INTEGER,
    avgSalePrice INTEGER,
    saleRate REAL,
    soldPerDay INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
