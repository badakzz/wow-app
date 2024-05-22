# WoW App Project

## AWS Postgresql Instructions

1 - Migrate schenma with Prisma : `npx prisma migrate dev` (exporting a DATABASE_URL environnment variable is required)
2 - Create extension : `CREATE EXTENSION aws_s3 CASCADE;`
3 - Import data from items.csv : `SELECT aws_s3.table_import_from_s3('public.items', '', '(FORMAT CSV)', 'wow-app-db', 'items.csv', 'eu-west-3');`
4 - Import data from prices_history.csv, mapping string 'NULL' to NULL value : `SELECT aws_s3.table_import_from_s3(
    'public.prices_history', 
    '', 
    '(FORMAT CSV, NULL ''NULL'')', 
    'wow-app-db', 
    'prices_history.csv', 
    'eu-west-3'
);`
