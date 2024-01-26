
# WoW Auction House Project - Database Setup Guide

## Introduction
This guide will help you set up the SQLite database for our WoW Auction House project. We use SQLite for its simplicity and ease of use, particularly suitable for our development setup. The database schema is defined in SQL migration files located in the `migrations` directory.

## Prerequisites
- Ensure you have SQLite installed on your machine. If not, you can download it from [SQLite's official site](https://sqlite.org/download.html).

## Database Setup Steps

### 1. Initialize the SQLite Database
We're using SQLite for our database, which stores data in a single file. To create this file and initialize our database, run the following command:

```bash
sqlite3 prices.db
```

This command creates a new file `prices.db` which is our SQLite database. Once the database file is created, you can exit the SQLite prompt:

```bash
.exit
```

### 2. Run the Migration
We maintain our database schema in SQL migration files. To set up the initial schema, run the following command:

```bash
sqlite3 prices.db < migrations/01_create_auction_history_table.sql
```

This command executes the SQL script inside `01_create_auction_history_table.sql` against our `prices.db` database, creating the necessary tables and schema.

### 3. Verifying the Setup
To verify that the table was created successfully, you can enter the SQLite command-line interface and list the tables:

```bash
sqlite3 prices.db
```

Then, in the SQLite prompt, run:

```sql
.tables
```

You should see `auction_history` listed among the tables. To exit the SQLite prompt, type `.exit`.

## Troubleshooting
If you encounter any issues, please refer to the SQLite documentation or reach out to the team for assistance.
