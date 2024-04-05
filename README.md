# WoW App Project

## Local docker-compose data mapping

1 - Dump mysql's database : `mysqldump -u <Username> -p<Password> <DatabaseName> > <DumpName>.sql`
2 - Copy the data inside the Docker container : `docker cp <DumpName>.sql b45db987ac0f:/wow_app_db_backup.sql`
3 - Import the data inside the container : `docker exec -it <ContainerId> mysql -u<Username> -p<Password> <DatabaseName>`
4 - Delete the dump file : `rm -f <DumpName>.sql`