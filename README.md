# WoW App Project

This app allows the user to track prices for several items in WoW SoD.
It also displays the top rankers for every raid encounter.
It uses Next.js and PostgreSQL.

https://wowapp.lucasderay.com

## Setup

### Database

Create a PostgreSQL database and user :

```shell
sudo -u postgres createuser -s -P -e wowappadm
sudo -u postgres createdb --encoding=UTF8 --owner=wowappadm wowappdb
```

### Environment variables

For the app to be fully functional, you will need to create a `.env.local` file specifying :

```
TSM_CLIENT_ID=''
TSM_API_KEY=''
WOW_CLIENT_ID=''
WOW_SECRET_KEY=''
DATABASE_URL="postgresql://wowappadm:[password]@localhost:5432/wowappdb"
WARCRAFT_LOGS_CLIENT_ID=''
WARCRAFT_LOGS_CLIENT_SECRET=''
```

### Prisma and seeding

Once the database and the environment variable DATABASE_URL are setup, you can run at root level :
```
npx prisma generate
npx prisma migrate dev
```
in order to seed the database with Prisma.


## Running the app

```
yarn install
yarn dev
```

## AWS Postgresql Instructions

1 - Migrate schema with Prisma : `npx prisma migrate dev` (exporting a DATABASE_URL environnment variable is required)
2 - Create extension : `CREATE EXTENSION aws_s3 CASCADE;`
3 - Import data from items.csv : `SELECT aws_s3.table_import_from_s3('public.items', '', '(FORMAT CSV)', 'wow-app-db', 'items.csv', 'eu-west-3');`
4 - Import data from prices_history.csv, mapping string 'NULL' to NULL value : 
`SELECT aws_s3.table_import_from_s3('public.prices_history', '', '(FORMAT CSV, NULL ''NULL'')', 'wow-app-db', 'prices_history.csv', 'eu-west-3');`
