#!/bin/sh

# Load environment variables
echo "Loading environment variables..."
export $(cat ./.env.local | xargs)

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Seed the database
echo "Seeding database..."
./clearDB.sh

# Start your application
echo "Starting application..."
yarn start
