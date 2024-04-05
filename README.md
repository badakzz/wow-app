# WoW App Project

## Local docker-compose data mapping

1 - Dump mysql's database : `mysqldump -u <Username> -p<Password> <DatabaseName> > <DumpName>.sql`
2 - Copy the data inside the Docker container : `docker cp <DumpName>.sql b45db987ac0f:/wow_app_db_backup.sql`
3 - Import the data inside the container : `docker exec -it <ContainerId> mysql -u<Username> -p<Password> <DatabaseName>`
4 - Delete the dump file : `rm -f <DumpName>.sql`

## AWS Postgresql Instructions

1 - Create extension : `CREATE EXTENSION aws_s3 CASCADE;`
2 - Import data from items.csv : `SELECT aws_s3.table_import_from_s3('public.items', '', '(FORMAT CSV)', 'wow-app-db', 'items.csv', 'eu-west-3');`
3 - Import data from prices_history.csv, mapping string 'NULL' to NULL value : `SELECT aws_s3.table_import_from_s3(
    'public.prices_history', 
    '', 
    '(FORMAT CSV, NULL ''NULL'')', 
    'wow-app-db', 
    'prices_history.csv', 
    'eu-west-3'
);`
