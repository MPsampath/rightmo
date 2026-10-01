#!/bin/sh
set -e

if [ ! -f .env ]; then
    cp .env.example .env
fi

if ! grep -q "^APP_KEY=.\+" .env; then
    php artisan key:generate --force
fi

if ! grep -q "^JWT_SECRET=.\+" .env; then
    php artisan jwt:secret --force
fi

FRESH_DB=0
if [ ! -f database/database.sqlite ]; then
    touch database/database.sqlite
    FRESH_DB=1
fi

php artisan migrate --force

if [ "$FRESH_DB" = "1" ]; then
    php artisan db:seed --force
fi

php artisan storage:link
php artisan config:clear

exec php artisan serve --host=0.0.0.0 --port=8000
