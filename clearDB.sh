#!/bin/sh
# Load environment variables
export $(cat .env.local | grep -v ^# | xargs)

# Navigate to the Prisma directory
cd prisma || exit

# Reset the database and apply all migrations
echo "Resetting database and re-applying all migrations..."
npx prisma migrate reset --force

echo "Seeding the database..."

node seeds/items.js
node seeds/prices_history.js

echo "Database has been reset and seeded."
