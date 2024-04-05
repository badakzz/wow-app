-- CreateTable
CREATE TABLE `prices_history` (
    `auctionHouseId` INTEGER NULL,
    `itemId` INTEGER NOT NULL,
    `petSpeciesId` INTEGER NULL,
    `minBuyout` INTEGER NULL,
    `quantity` INTEGER NULL,
    `marketValue` INTEGER NULL,
    `historical` INTEGER NULL,
    `numAuctions` INTEGER NULL,
    `snapshotDate` DATETIME NOT NULL,

    PRIMARY KEY (`itemId`, `snapshotDate`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `items` (
    `itemId` INTEGER NOT NULL,
    `itemName` VARCHAR(191) NULL,
    `itemRarity` VARCHAR(191) NULL,
    `mediaUrl` VARCHAR(191) NULL,

    PRIMARY KEY (`itemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
