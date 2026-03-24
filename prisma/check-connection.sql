-- prisma/check-connection.sql
SELECT 'Connected to database' AS status, 
       current_database() AS database, 
       current_user AS user, 
       version() AS version;