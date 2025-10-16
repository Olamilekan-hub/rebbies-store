#!/bin/bash

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Generate the database schema
npx prisma db push

# Seed the database with initial data
node server/utils/insertDemoData.js
