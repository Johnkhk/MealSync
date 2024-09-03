# Start postgres db:
brew services start postgresql

# Run create tables query:
`psql -U mealsync_admin -d mealsync_db -f backend_server/queries/create_tables.sql`

# Run drop tables query:
`psql -U mealsync_admin -d mealsync_db -f backend_server/queries/drop_tables.sql`