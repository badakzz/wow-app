-- CreateTable
CREATE TABLE "prices_history" (
    "auctionHouseId" INTEGER,
    "itemId" INTEGER NOT NULL,
    "petSpeciesId" INTEGER,
    "minBuyout" INTEGER,
    "quantity" INTEGER,
    "marketValue" INTEGER,
    "historical" INTEGER,
    "numAuctions" INTEGER,
    "snapshotDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prices_history_pkey" PRIMARY KEY ("itemId","snapshotDate")
);

-- CreateTable
CREATE TABLE "items" (
    "itemId" INTEGER NOT NULL,
    "itemName" TEXT,
    "itemRarity" TEXT,
    "mediaUrl" TEXT,

    CONSTRAINT "items_pkey" PRIMARY KEY ("itemId")
);
